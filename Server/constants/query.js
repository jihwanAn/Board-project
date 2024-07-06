const QUERY = {
  // USER
  GET_USER: `SELECT * FROM users WHERE platform=? AND email=?`,
  CHECK_NICKNAME: `SELECT nick_name FROM users WHERE nick_name = ?`,
  REGISTER_ACCOUNT: `INSERT INTO users (platform, email, nick_name)
      VALUES (?, ?, ?)`,

  // TOKEN
  SAVE_TOKEN: `INSERT INTO tokens (email, access_token, refresh_token)
     VALUES (?, ?, ?)`,
  DELETE_TOKEN: "DELETE FROM tokens WHERE access_token = ?",
  FIND_REFRESH_TOKEN: "SELECT refresh_token FROM tokens WHERE access_token = ?",
  UPDATE_TOKENS:
    "UPDATE tokens SET access_token = ?, refresh_token = ? WHERE email = ?",

  // BOARD
  GET_BOARD: `SELECT * FROM board ORDER BY created_at DESC`,
  CREATE_POST: `INSERT INTO board (email, nick_name, title, content, created_at, view_count) 
    VALUES (?, ?, ?, ?, NOW(), 0)`,
};

module.exports = { QUERY };
