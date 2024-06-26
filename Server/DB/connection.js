const mariadb = require("mariadb");
const dotenv = require("dotenv");
dotenv.config();

const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  database: "my_db",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectionLimit: 10,
});

module.exports = {
  pool,
};
