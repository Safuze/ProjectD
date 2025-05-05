/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import cors from 'cors';
import crypto from 'crypto'; // Для генерации токенов (остается нужным, если где-то еще используется)
import nodemailer from 'nodemailer'; // Для отправки email
import dotenv from 'dotenv'; // Для переменных окружения
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec); // оборачиваем в промис для await
// Загружаем переменные окружения из файла .env
dotenv.config();
const app = express();
// Используем порт из переменных о
// кружения или 3001 по умолчанию
const port = process.env.PORT || 3001;

// Конфигурация базы данных MySQL (ИСПОЛЬЗУЙТЕ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ!)
const dbConfig = {
  host: process.env.DB_HOST, // Берем из .env
  user: process.env.DB_USER, // Берем из .env
  password: process.env.DB_PASSWORD, // Берем из .env
  database: process.env.DB_DATABASE, // Берем из .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00' // Важно для корректной работы с DATETIME/TIMESTAMP
};

// Конфигурация отправки почты
let mailTransporter;

// Папка для сохранения шаблонов
const uploadDir = path.join(process.cwd(), 'uploads', 'templates');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb  ) => {
    // Префикс даты для уникальности
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

async function setupEmail() {
  try {

    console.log(`Настройка почты через реальный SMTP (${process.env.EMAIL_HOST})...`);
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Переменные окружения EMAIL_HOST, EMAIL_USER и EMAIL_PASS должны быть установлены в .env файле!');
    }
    mailTransporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: (process.env.EMAIL_PORT === '465'), // true для 465, false для 587/2525
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // tls: { rejectUnauthorized: false } // Раскомментировать при проблемах с сертификатом
    });

    // Проверка соединения с SMTP сервером
    await mailTransporter.verify();
    console.log(`✅ Email transporter успешно подключен к ${process.env.EMAIL_HOST}.`);

  } catch (error) {
    console.error('❌ Не удалось настроить или проверить транспорт почты:', error);
    mailTransporter = null;
  }
}

// --- Инициализация ---

const pool = mysql.createPool(dbConfig);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads/templates', express.static(uploadDir));


// --- Функции ---

async function testDbConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.ping();
    console.log('✅ База данных подключена');
  } catch (err) {
      console.error('❌ Ошибка подключения к БД:', err.message);
      console.error(`   Host: ${dbConfig.host}, User: ${dbConfig.user}, DB: ${dbConfig.database}`);
      throw err;
  }
  finally {
    if (conn) conn.release();
  }
}

async function checkTableStructure() {
  const conn = await pool.getConnection();
  try {
    // Проверяем существование таблицы
    const [tables] = await conn.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'user_data'`, 
      [process.env.DB_DATABASE]
    );
    
    if (tables.length === 0) {
      console.log('❌ Таблица user_data не существует!');
      return false;
    }

    // Проверяем существование столбцов
    const [columns] = await conn.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'user_data'`,
      [process.env.DB_DATABASE]
    );
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Существующие столбцы:', columnNames);

    const requiredColumns = ['full_name', 'firm', 'position'];
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.log(`❌ Отсутствующие столбцы: ${missingColumns.join(', ')}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Ошибка при проверке структуры таблицы:', err);
    return false;
  } finally {
    conn.release();
  }
}

async function createTable() {
    const conn = await pool.getConnection();
    try {
      // Сначала проверяем существование таблицы
      const [tables] = await conn.query(
        `SELECT TABLE_NAME FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'user_data'`, 
        [process.env.DB_DATABASE]
      );
      if (tables.length === 0) {
      // Таблицы нет - создаем заново
        await conn.query(`
          CREATE TABLE IF NOT EXISTS user_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NULL,
            firm VARCHAR(255) NULL,
            position VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reset_token VARCHAR(255) NULL,
            reset_token_expires_at DATETIME NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ Таблица user_data создана или уже существует.');
        } else {
          // Таблица существует - проверяем и добавляем недостающие столбцы
        const [columns] = await conn.query(`DESCRIBE user_data;`);
        const columnNames = columns.map(col => col.Field);

        if (!columnNames.includes('full_name')) {
          await conn.query(`ALTER TABLE user_data ADD COLUMN full_name VARCHAR(255) NULL;`);
          console.log('✅ Столбец full_name добавлен.');
        }

        if (!columnNames.includes('firm')) {
          await conn.query(`ALTER TABLE user_data ADD COLUMN firm VARCHAR(255) NULL;`);
          console.log('✅ Столбец firm добавлен.');
        }

        if (!columnNames.includes('position')) {
          await conn.query(`ALTER TABLE user_data ADD COLUMN position VARCHAR(255) NULL;`);
          console.log('✅ Столбец position добавлен.');
        }
      
        if (!columnNames.includes('reset_token')) {
            await conn.query(`ALTER TABLE user_data ADD COLUMN reset_token VARCHAR(255) NULL;`);
            console.log('✅ Столбец reset_token добавлен.');
        } else {
            console.log('ℹ️ Столбец reset_token уже существует.');
        }

        if (!columnNames.includes('reset_token_expires_at')) {
            await conn.query(`ALTER TABLE user_data ADD COLUMN reset_token_expires_at DATETIME NULL;`);
            console.log('✅ Столбец reset_token_expires_at добавлен.');
        } else {
             console.log('ℹ️ Столбец reset_token_expires_at уже существует.');
        }

        const [indexes] = await conn.query(`SHOW INDEX FROM user_data;`);
        const indexNames = indexes.map(idx => idx.Key_name);

        if (columnNames.includes('email') && !indexNames.includes('idx_email')) {
             try {
                await conn.query(`ALTER TABLE user_data ADD INDEX idx_email (email);`);
                console.log('✅ Индекс idx_email добавлен.');
             } catch (indexError) {
                 if (indexError.code === 'ER_DUP_KEYNAME' || indexError.errno === 1061) {
                    console.log('ℹ️ Индекс idx_email уже существует.');
                 } else { throw indexError; }
             }
        }

        if (columnNames.includes('reset_token') && !indexNames.includes('idx_reset_token')) {
             try {
                await conn.query(`ALTER TABLE user_data ADD INDEX idx_reset_token (reset_token);`);
                console.log('✅ Индекс idx_reset_token добавлен.');
             } catch (indexError) {
                if (indexError.code === 'ER_DUP_KEYNAME' || indexError.errno === 1061) {
                    console.log('ℹ️ Индекс idx_reset_token уже существует.');
                } else { throw indexError; }
             }
        }
        console.log('✅ Таблица user_data полностью готова к работе.');
      }
        // Внутри createTable() после user_data:
        await conn.query(`
          CREATE TABLE IF NOT EXISTS templates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firm VARCHAR(255) NOT NULL,
            format VARCHAR(50) NOT NULL,
            filename VARCHAR(255) NOT NULL,
            file LONGBLOB NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅ Таблица templates готова');
    } catch (err) {
        console.error('❌ Ошибка при настройке таблицы user_data:', err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

// --- Маршруты (Endpoints) ---

app.get('/', (req, res) => {
  res.send(`
    <h1>Сервер работает! (Порт ${port})</h1>
    <p>Доступные endpoints:</p>
    <ul>
      <li><a href="/test">/test</a> - Проверка БД</li>
      <li>POST /register - Регистрация</li>
      <li>POST /login - Авторизация</li>
      <li>POST /forgot-password - Запрос сброса пароля</li>
      <li>POST /reset-password - Установка нового пароля</li>
    </ul>
    ${mailTransporter ? `<p style="color: green;">✅ Email транспорт настроен (${process.env.EMAIL_HOST}).</p>` : '<p style="color: red;">❌ Email транспорт НЕ настроен!</p>'}
    ${!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'ЗАМЕНИ_МЕНЯ_В_ENV_ФАЙЛЕ' ? '<p style="color: orange; font-weight: bold;">⚠️ ПРЕДУПРЕЖДЕНИЕ: Пароль БД не задан или используется значение по умолчанию. Настройте .env файл!</p>' : ''}
  `);
});

app.get('/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS time, 1+1 AS math');
    res.json({ status: 'OK', databaseTime: rows[0].time, mathResult: rows[0].math });
  } catch (err) {
    console.error("Ошибка /test:", err);
    res.status(500).json({ error: 'Ошибка БД: ' + err.message });
  }
});

app.post('/register', async (req, res) => {
  const { login, email, password } = req.body;

  if (!login || !email || !password) return res.status(400).json({ message: 'Все поля обязательны' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Некорректный формат email' });
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(login) || login.length < 4) return res.status(400).json({ message: 'Логин: минимум 4 символа, латиница и цифры, начинается с буквы' });
  if (password.length < 4) return res.status(400).json({ message: 'Пароль должен быть не менее 4 символов' });

  let conn;
  try {
    conn = await pool.getConnection();
    const [existing] = await conn.query('SELECT id FROM user_data WHERE login = ? OR email = ? LIMIT 1', [login, email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Логин или email уже заняты' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await conn.query('INSERT INTO user_data (login, email, password_hash) VALUES (?, ?, ?)', [login, email, hash]);
    res.status(201).json({ success: true, userId: result.insertId, message: 'Регистрация успешна' });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  } finally {
    if (conn) conn.release();
  }
});

app.post('/login', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ message: 'Логин и пароль обязательны' });

  let conn;
  try {
    conn = await pool.getConnection();
    const [users] = await conn.query('SELECT id, login, email, password_hash FROM user_data WHERE login = ? LIMIT 1', [login]);
    if (users.length === 0) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Неверный логин или пароль' });

    res.json({ success: true, user: { id: user.id, login: user.login, email: user.email } });
  } catch (err) {
    console.error('Ошибка авторизации:', err);
    res.status(500).json({ message: 'Ошибка сервера при авторизации' });
  } finally {
    if (conn) conn.release();
  }
});

// === ЭНДПОИНТЫ ДЛЯ СБРОСА ПАРОЛЯ ===

// POST /forgot-password - Запрос на сброс пароля (с 4-значным кодом)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const genericMessage = 'Если email найден в системе, на него будет отправлена инструкция по сбросу пароля.';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Некорректный формат email' });
  }

  if (!mailTransporter) {
    console.error('❌ Mail transporter не настроен. Невозможно отправить email.');
    return res.status(503).json({ message: 'Сервис отправки почты временно недоступен.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const [users] = await conn.query(
      'SELECT id, login FROM user_data WHERE email = ? LIMIT 1',
      [email]
    );

    if (users.length > 0) {
      const user = users[0];

      // --- Генерируем 4-значный цифровой код ---
      const token = String(Math.floor(1000 + Math.random() * 9000));
      // --- Конец изменения ---

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // + 15 минут

      await conn.query(
        'UPDATE user_data SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?',
        [token, expiresAt, user.id]
      );

      const mailOptions = {
        from: process.env.EMAIL_FROM, // Берем из .env
        to: email,
        subject: 'Сброс пароля - Код подтверждения',
        text: `Здравствуйте, ${user.login}!\n\nВы запросили сброс пароля. Ваш код подтверждения (действителен 15 минут):\n\n${token}\n\nЕсли вы не запрашивали сброс, просто проигнорируйте это письмо.\n`,
        html: `<p>Здравствуйте, ${user.login}!</p>
               <p>Вы запросили сброс пароля. Ваш код подтверждения (действителен 15 минут):</p>
               <h2 style="font-family: monospace; background-color: #f0f0f0; padding: 10px; display: inline-block; letter-spacing: 2px;">${token}</h2>
               <p>Если вы не запрашивали сброс, просто проигнорируйте это письмо.</p>`,
      };

      try {
        let info = await mailTransporter.sendMail(mailOptions);
        console.log(`✅ Код для сброса пароля (${token}) отправлен на ${email}. Message ID: ${info.messageId}`);
      } catch (mailError) {
        console.error(`❌ Ошибка отправки email на ${email} через ${process.env.EMAIL_HOST}:`, mailError);
      }
    } else {
      console.log(`ℹ️ Запрос на сброс пароля для несуществующего email: ${email}`);
    }

    res.status(200).json({ message: genericMessage });

  } catch (err) {
    console.error('Ошибка при запросе сброса пароля:', err);
    res.status(500).json({ message: 'Ошибка сервера при обработке запроса.' });
  } finally {
    if (conn) conn.release();
  }
});

// POST /reset-password - Проверка токена (кода) и установка нового пароля
app.post('/reset-password', async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body; // token здесь - это 4-значный код

    if (!token || !newPassword || !confirmPassword) return res.status(400).json({ message: 'Необходимо предоставить код, новый пароль и подтверждение.' });
    if (newPassword.length < 4) return res.status(400).json({ message: 'Пароль должен быть не менее 4 символов.' });
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Пароли не совпадают.' });

    let conn;
    try {
        conn = await pool.getConnection();
        const [users] = await conn.query(
            'SELECT id, login, email, reset_token_expires_at FROM user_data WHERE reset_token = ? LIMIT 1',
            [token] // Ищем по 4-значному коду
        );

        if (users.length === 0) {
            console.log(`⚠️ Попытка сброса пароля с неверным кодом: ${token}`);
            return res.status(400).json({ message: 'Неверный или устаревший код сброса.' });
        }

        const user = users[0];
        const now = new Date();

        if (!user.reset_token_expires_at || new Date(user.reset_token_expires_at) < now) {
            console.log(`⚠️ Попытка сброса пароля с истекшим кодом для пользователя ${user.login}`);
            await conn.query('UPDATE user_data SET reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?', [user.id]);
            return res.status(400).json({ message: 'Неверный или устаревший код сброса.' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await conn.query(
            'UPDATE user_data SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?',
            [newPasswordHash, user.id]
        );
        console.log(`✅ Пароль для пользователя ${user.login} (ID: ${user.id}) успешно сброшен.`);

        if (mailTransporter && user.email) {
          try {
            const info = await mailTransporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: user.email,
              subject: 'Пароль успешно изменен',
              text: `Здравствуйте, ${user.login}!\n\nВаш пароль был успешно изменен. Если это были не вы, пожалуйста, свяжитесь с поддержкой.\n`,
              html: `<p>Здравствуйте, ${user.login}!</p><p>Ваш пароль был успешно изменен. Если это были не вы, пожалуйста, свяжитесь с поддержкой.</p>`,
            });
            console.log(`✅ Email-подтверждение смены пароля отправлен на ${user.email}. Message ID: ${info.messageId}`);
          } catch (mailError) {
             console.error(`❌ Ошибка отправки подтверждения о смене пароля на ${user.email} через ${process.env.EMAIL_HOST}:`, mailError);
          }
        } else if (!user.email) {
            console.warn(`⚠️ Не удалось отправить подтверждение смены пароля: email для пользователя ID ${user.id} не найден.`);
        }

        res.status(200).json({ success: true, message: 'Пароль успешно изменен.' });

    } catch (err) {
        console.error('Ошибка при сбросе пароля:', err);
        res.status(500).json({ message: 'Ошибка сервера при сбросе пароля.' });
    } finally {
        if (conn) conn.release();
    }
});



// GET /get-user-profile - Получение данных профиля пользователя
app.get('/get-user-profile', async (req, res) => {
  const { login } = req.query;

  if (!login) return res.status(400).json({ message: 'Логин обязателен' });

  let conn;
  try {
    conn = await pool.getConnection();
    const [users] = await conn.query(
      'SELECT login, email, full_name, firm, position FROM user_data WHERE login = ? LIMIT 1',
      [login]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ success: true, user: users[0] });
  } catch (err) {
    console.error('Ошибка при получении профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера при получении профиля' });
  } finally {
    if (conn) conn.release();
  }
});

// PUT /update-user-profile - Обновление профиля пользователя (ФИО и должность)
app.put('/update-user-profile', async (req, res) => {
  console.log('Получен запрос на обновление профиля:', req.body);

  const { login, fullName, firm, position } = req.body;

  if (!login) {
    console.log('Ошибка: логин обязателен');
    return res.status(400).json({ message: 'Логин обязателен' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Подключение к БД установлено');

    // Добавьте проверку структуры таблицы перед выполнением запроса
    const [columns] = await conn.query(`DESCRIBE user_data;`);
    console.log('Столбцы таблицы:', columns.map(c => c.Field));

    const [users] = await conn.query('SELECT id FROM user_data WHERE login = ? LIMIT 1', [login]);
    if (users.length === 0) {
      console.log('Пользователь не найден:', login);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    console.log('Обновляю данные для пользователя:', login, 'ФИО:', fullName, 'Компания:', firm, 'Должность:', position);
    
    await conn.query(
      'UPDATE user_data SET full_name = ?, firm = ?, position = ? WHERE login = ?',
      [fullName || null, firm || null, position || null, login]
    );

    console.log('Данные успешно обновлены');
    res.json({ success: true, message: 'Данные профиля успешно обновлены' });
  } catch (err) {
    console.error('Ошибка при обновлении профиля:', err);
    
    // Добавьте дополнительную диагностику
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      console.error('❌ ОШИБКА: Запрошенный столбец не существует в таблице!');
      const [columns] = await conn.query(`DESCRIBE user_data;`);
      console.error('Фактические столбцы таблицы:', columns);
    }
    
    res.status(500).json({ 
      message: 'Ошибка сервера при обновлении профиля',
      errorDetails: err.message,
      errorCode: err.code
    });
  } finally {
    if (conn) {
      console.log('Закрываю соединение с БД');
      conn.release();
    }
  }
});

app.post('/api/preview-template', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Файл обязателен' });
  }

  const docxPath = path.join(uploadDir, file.filename);
  const pdfFilename = file.filename.replace(/\.docx$/i, '.pdf');
  const pdfPath = path.join(uploadDir, pdfFilename);
  const pdfUrl = `/uploads/templates/${pdfFilename}`;

  try {
    await execAsync(`soffice --headless --convert-to pdf "${docxPath}" --outdir "${uploadDir}"`);
    res.status(200).json({ pdfUrl, docxFilename: file.filename });
  } catch (err) {
    console.error('Ошибка при генерации PDF:', err.stderr || err.message);
    res.status(500).json({ error: 'Ошибка при создании PDF' });
  }
});

app.post('/api/templates', upload.single('file'), async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  const { firm, format } = req.body;
  const file = req.file;

  if (!firm || !format || !file) {
    return res.status(400).json({ error: 'Все поля (firm, format, file) обязательны' });
  }

  const docxPath = path.join(uploadDir, file.filename);
  const pdfFilename = file.filename.replace(/\.docx$/i, '.pdf');
  const pdfPath = path.join(uploadDir, pdfFilename);
  const pdfUrl = `/uploads/templates/${pdfFilename}`;
  console.log('Файл загружен:', file.filename);

  try {
    try {
      const { stdout, stderr } = await execAsync(`soffice --headless --convert-to pdf "${docxPath}" --outdir "${uploadDir}"`);
      console.log('LibreOffice STDOUT:', stdout);
      console.error('LibreOffice STDERR:', stderr);
    } catch (err) {
      console.error('Ошибка при конвертации в PDF:', err.stderr || err.message);
      return res.status(500).json({ error: 'Ошибка при создании PDF', details: err.stderr || err.message });
    }
  } catch (err) {
    console.error('Ошибка при конвертации в PDF:', err.stderr || err.message);
    return res.status(500).json({ error: 'Ошибка при создании PDF' });
  }

  let fileBuffer;
  try {
    fileBuffer = fs.readFileSync(docxPath);
  } catch (err) {
    console.error('Ошибка чтения файла с диска:', err);
    return res.status(500).json({ error: 'Ошибка чтения файла' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.query(
      'INSERT INTO templates (firm, format, filename, created_at, file) VALUES (?, ?, ?, NOW(), ?)',
      [firm, format, file.filename, fileBuffer]
    );

    res.status(201).json({ message: 'Шаблон успешно сохранен', pdfUrl });
  } catch (err) {
    console.error('Ошибка сохранения шаблона в БД:', err);
    res.status(500).json({ error: 'Ошибка сервера при сохранении шаблона' });
  } finally {
    conn.release();
  }
});


app.get('/api/templates/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Файл не найден' });
  }

  res.download(filePath, filename); // Отправляем файл как есть
});

app.get('/api/templates', async (req, res) => {
  const { firm, format } = req.query;
  const conn = await pool.getConnection();
  try {
    let query = 'SELECT * FROM templates';
    const params = [];
    const conditions = [];

    if (firm && firm.trim() !== '') {
      conditions.push('firm = ?');
      params.push(firm);
    }

    if (format && format.trim() !== '') {
      conditions.push('format = ?');
      params.push(format);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at ASC';

    const [rows] = await conn.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Ошибка получения шаблонов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    conn.release();
  }
});

// Отдаем шаблоны на страницу шаблонов
app.get('/api/templates', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(`
      SELECT id, firm, format, filename, created_at
      FROM templates
      ORDER BY created_at DESC
    `);

    const withUrls = rows.map(row => ({
      ...row,
      pdfUrl: `/uploads/templates/${row.filename.replace(/\.docx$/i, '.pdf')}`
    }));

    res.json(withUrls);
  } catch (err) {
    console.error("Ошибка получения шаблонов:", err);
    res.status(500).json({ error: "Ошибка при загрузке шаблонов" });
  } finally {
    conn.release();
  }
});

// --- Запуск сервера ---

async function start() {
  try {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Не все переменные окружения для базы данных установлены в .env!');
        process.exit(1);
    }
     if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
        console.warn('⚠️ ПРЕДУПРЕЖДЕНИЕ: Не все переменные окружения для отправки почты установлены в .env. Отправка почты может не работать.');
    }

    await testDbConnection();
    await createTable();
    await setupEmail(); // Настраиваем и проверяем почт

    await testDbConnection();
        const structureValid = await checkTableStructure();
    if (!structureValid) {
      console.log('🔄 Пытаемся исправить структуру таблицы...');
      await createTable();
    }

    await setupEmail();

    app.listen(port, () => {
      console.log(`🚀 Сервер запущен: http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ЗАПУСКА СЕРВЕРА:', err.message || err);
    process.exit(1);
  }
}

// Запуск приложения
start();