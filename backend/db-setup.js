// db-setup.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  const sql = fs.readFileSync('./schema.sql', 'utf8');
  await connection.query(sql);
  console.log('Database schema created!');
  await connection.end();
}

setup().catch(console.error);