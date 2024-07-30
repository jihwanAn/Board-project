const fs = require("fs");
const path = require("path");
const mariadb = require("mariadb");
const dotenv = require("dotenv");
dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: 10,
});

// SQL 파일 실행
const executeSqlFile = async (filePath) => {
  const absolutePath = path.resolve(__dirname, filePath);
  const sql = fs.readFileSync(absolutePath, "utf8");

  const queries = sql
    .split(";")
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (let query of queries) {
    await executeQuery(query);
  }
};

// 쿼리 실행
const executeQuery = async (query, params) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query(query, params);

    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  pool,
  executeQuery,
  executeSqlFile,
};
