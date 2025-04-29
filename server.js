/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { Client } from 'ssh2';

const app = express();
const port = 3001;

// Конфигурация SSH
const sshConfig = {
  host: '95.163.221.170',
  port: 22,
  username: 'root',
  password: 'j72km7tb1qUrpYqx'
};

// Конфигурация базы данных 
const dbConfig = {
  host: '95.163.221.170',
  user: 'admin',
  password: 'FtyobF44#!',
  database: 'my_app_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);
const sshClient = new Client();

app.use(cors({
    origin: 'http://localhost:5173', // или ваш клиентский URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(express.json());

// SSH подключение
function connectToServer() {
  return new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
      console.log('✅ SSH подключение установлено');
      
      // Выполняем команду для проверки содержимого домашней директории
      sshClient.exec('ls', (err, stream) => {
        if (err) reject(err);
        
        let output = '';
        stream.on('data', (data) => output += data)
              .on('close', () => {
                console.log('Содержимое домашней директории сервера:\n' + output);
                sshClient.end();
                resolve();
              });
      });
    }).on('error', (err) => {
      console.error('SSH ошибка:', err);
      reject(err);
    }).connect(sshConfig);
  });
}

// Проверка соединения с БД
async function testDbConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log('✅ База данных подключена');
  } finally {
    conn.release();
  }
}

// Создание таблицы
async function createTable() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        login VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Таблица user_data готова');
  } finally {
    conn.release();
  }
}

// Тестовый endpoint
app.get('/', (req, res) => {
  res.send(`
    <h1>Сервер работает! (Порт ${port})</h1>
    <p>Доступные endpoints:</p>
    <ul>
      <li><a href="/test">/test</a> - Проверка БД</li>
      <li>POST /register - Регистрация</li>
      <li>POST /login - Авторизация</li>
    </ul>
  `);
});

// Проверка работы БД
app.get('/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS time, 1+1 AS math');
    res.json({ 
      status: 'OK',
      database: rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Регистрация
app.post('/register', async (req, res) => {
  const { login, email, password } = req.body;

  if (!login || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const conn = await pool.getConnection();
  try {
    // Проверка существующего пользователя
    const [existing] = await conn.query(
      'SELECT id FROM user_data WHERE login = ? OR email = ? LIMIT 1',
      [login, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Логин или email уже заняты' });
    }

    // Хеширование пароля
    const hash = await bcrypt.hash(password, 10);

    // Сохранение пользователя
    const [result] = await conn.query(
      'INSERT INTO user_data (login, email, password_hash) VALUES (?, ?, ?)',
      [login, email, hash]
    );

    res.status(201).json({ 
      success: true,
      userId: result.insertId 
    });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    conn.release();
  }
});

// Авторизация
app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: 'Логин и пароль обязательны' });
  }

  const conn = await pool.getConnection();
  try {
    // Поиск пользователя
    const [users] = await conn.query(
      'SELECT * FROM user_data WHERE login = ? LIMIT 1',
      [login]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    // Проверка пароля
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    // Успешная авторизация
    res.json({ 
      success: true,
      user: {
        id: user.id,
        login: user.login,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Ошибка авторизации:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    conn.release();
  }
});

// Запуск сервера
async function start() {
  await testDbConnection();
  await createTable();

  try {
    await connectToServer();
  } catch (err) {
    console.error('Ошибка подключения к серверу:', err);
  }

  app.listen(port, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${port}`);
  });
}

start().catch(err => {
  console.error('Ошибка запуска:', err);
  process.exit(1);
});
