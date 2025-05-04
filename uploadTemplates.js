/* eslint-disable no-undef */

// uploadTemplates.js (ES-модульный стиль)
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Эти две строки нужны вместо __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const connection  = await mysql.createConnection({
  user: 'admin',
  host: '95.163.221.170',
  database: 'my_app_database',
  password: 'FtyobF44#!',
  port: 3306,
});

const templates = [
  { filename: 'akt_anime.docx', firm: 'Аниме', format: 'Акт' },
  { filename: 'akt_mega.docx', firm: 'Мега', format: 'Акт' },
  { filename: 'akt_more.docx', firm: 'Море', format: 'Акт' },
  { filename: 'akt_giraf.docx', firm: 'Жираф', format: 'Акт' },
  { filename: 'akt_byt.docx', firm: 'Байт', format: 'Акт' },
  { filename: 'zakaz_anime.docx', firm: 'Аниме', format: 'Заказ' },
  { filename: 'zakaz_mega.docx', firm: 'Мега', format: 'Заказ' },
  { filename: 'zakaz_byt.docx', firm: 'Байт', format: 'Заказ' },
  { filename: 'otchet_giraf.docx', firm: 'Жираф', format: 'Отчет' },
  { filename: 'otchet_more.docx', firm: 'Море', format: 'Отчет' },
];

for (const template of templates) {
  const filePath = path.join(__dirname, 'templates', template.filename);
  const fileBuffer = fs.readFileSync(filePath);

  // 1. Добавление колонки — если ты это делаешь один раз, вообще лучше вынеси из скрипта!
  // await connection.execute(`ALTER TABLE templates ADD COLUMN file LONGBLOB;`);

  // 2. Вставка файла
  await connection.execute(
    `INSERT INTO templates (firm, format, filename, file) VALUES (?, ?, ?, ?)`,
    [template.firm, template.format, template.filename, fileBuffer]
  );
}

console.log('Все шаблоны успешно загружены!');
await connection.end();