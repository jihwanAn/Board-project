const QUERY = {
  GET_USER: `SELECT * FROM users WHERE platform=? AND email=?;`,

  CHECK_NICKNAME: `SELECT nick_name FROM users WHERE nick_name = ?`,

  REGISTER_ACCOUNT: `INSERT INTO users (platform, email, nick_name)
      VALUES (?, ?, ?)`,
};

module.exports = { QUERY };
