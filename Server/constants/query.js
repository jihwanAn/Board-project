const QUERY = {
  // USER
  SIGNUP_USER: `INSERT INTO users (platform, email, password, nick_name)
      VALUES ("local", ?, ?, ?)`,
  GET_USER: `SELECT * FROM users WHERE platform=? AND email=?`,
  CHECK_NICKNAME: `SELECT nick_name FROM users WHERE nick_name = ?`,
  REGISTER_ACCOUNT: `INSERT INTO users (platform, email, nick_name) VALUES (?, ?, ?)`,

  // TOKEN
  SAVE_TOKEN: `INSERT INTO tokens (user_id, access_token, refresh_token) VALUES (?, ?, ?)`,
  DELETE_TOKEN: `DELETE FROM tokens WHERE access_token = ?`,
  FIND_REFRESH_TOKEN: `SELECT refresh_token FROM tokens WHERE access_token = ?`,
  UPDATE_TOKENS: `UPDATE tokens SET access_token = ?, refresh_token = ? WHERE user_id = ?`,

  // POSTS
  POSTS_COUNT: `SELECT COUNT(*) AS count FROM posts`,
  GET_POSTS: `SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  GET_POST_BY_ID: `SELECT * FROM posts WHERE id = ?`,
  CHECK_POST_OWNER: `SELECT user_id FROM posts WHERE id = ?`,
  CREATE_POST: `INSERT INTO posts (user_id, category_id, title, content, created_at, view_count) 
    VALUES ( ?, ?, ?, ?, NOW(), 0)`,
  EDIT_POST: `UPDATE posts SET category_id = ?, title = ?, content = ? WHERE id = ?`,
  DELETE_POST: `DELETE FROM posts WHERE id = ?`,
  POSTS_CATEGORY_COUNT: `SELECT COUNT(*) AS count FROM posts WHERE category_id = ?`,
  POSTS_CATEGORY: `SELECT * FROM posts WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,

  // COMMENTS
  CREATE_COMMENT: `INSERT INTO comments (user_id, post_id, content, parent_id, created_at) VALUES ( ?, ?, ?, NULL, NOW())`,
};

module.exports = { QUERY };
