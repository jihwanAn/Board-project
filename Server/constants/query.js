const QUERY = {
  // USER
  SIGNUP_USER: `INSERT INTO users (platform, email, password, nick_name) VALUES ("local", ?, ?, ?)`,
  GET_USER: `SELECT * FROM users WHERE platform=? AND email=?`,
  CHECK_NICKNAME: `SELECT nick_name FROM users WHERE nick_name = ?`,
  REGISTER_ACCOUNT: `INSERT INTO users (platform, email, nick_name) VALUES (?, ?, ?)`,
  CHANGE_USER_NICK_NAME: `UPDATE users SET nick_name = ? WHERE id = ?`,

  // TOKEN
  SAVE_TOKEN: `INSERT INTO tokens (user_id, access_token, refresh_token) VALUES (?, ?, ?)`,
  DELETE_TOKEN_BY_ACCESS: `DELETE FROM tokens WHERE access_token = ?`,
  DELETE_TOKEN_BY_USER_ID: `DELETE FROM tokens WHERE user_id = ?`,
  FIND_REFRESH_TOKEN: `SELECT refresh_token FROM tokens WHERE access_token = ?`,
  UPDATE_TOKENS: `UPDATE tokens SET access_token = ?, refresh_token = ? WHERE user_id = ?`,

  // POSTS
  CHECK_CATEGORY: `SELECT COUNT(*) as count FROM categories WHERE id = ? AND name = ?`,
  INSERT_CATEGORIES: `INSERT INTO categories (id, name) VALUES (?, ?)`,

  POSTS_COUNT: `SELECT COUNT(*) AS count FROM posts`,
  GET_POSTS: `SELECT p.id, p.title, p.created_at, p.views, u.nick_name, CONVERT(COALESCE(comment_counts.comment_count, 0), CHAR) AS comments_count, CONVERT(COALESCE(like_counts.like_count, 0),CHAR) AS likes_count 
          FROM posts p 
          JOIN users u ON p.user_id = u.id 
          LEFT JOIN (SELECT post_id, COUNT(*) AS comment_count FROM comments GROUP BY post_id) AS comment_counts ON p.id = comment_counts.post_id
          LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM likes GROUP BY post_id) AS like_counts ON p.id = like_counts.post_id
          ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
  GET_POST_BY_ID: `SELECT p.*, u.nick_name FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?`,
  GET_POSTS_BY_USER_ID: `SELECT p.id, p.title, p.created_at FROM posts p WHERE user_id = ?`,
  CREATE_POST: `INSERT INTO posts (user_id, category_id, title, content, created_at, views) VALUES ( ?, ?, ?, ?, NOW(), 0)`,
  EDIT_POST: `UPDATE posts SET category_id = ?, title = ?, content = ? WHERE id = ?`,
  DELETE_POST: `DELETE FROM posts WHERE id = ?`,

  POSTS_CATEGORY_COUNT: `SELECT COUNT(*) AS count FROM posts WHERE category_id = ?`,
  POSTS_CATEGORY: `SELECT p.id, p.title, p.created_at, p.views, u.nick_name, CONVERT(COALESCE(comment_counts.comment_count, 0), CHAR) AS comments_count, CONVERT(COALESCE(like_counts.like_count, 0),CHAR) AS likes_count 
          FROM posts p
          JOIN users u ON p.user_id = u.id 
          LEFT JOIN (SELECT post_id, COUNT(*) AS comment_count FROM comments GROUP BY post_id) AS comment_counts ON p.id = comment_counts.post_id
          LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM likes GROUP BY post_id) AS like_counts ON p.id = like_counts.post_id WHERE p.category_id = ?
          ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,

  GET_COMMENTS_BY_POST_ID: `SELECT c.*, u.nick_name FROM posts p LEFT JOIN comments c ON c.post_id = p.id LEFT JOIN users u ON c.user_id = u.id WHERE p.id = ? ORDER BY c.created_at DESC`,
  ADD_COMMENT: `INSERT INTO comments (user_id, post_id, content, parent_id, created_at) VALUES ( ?, ?, ?, NULL, NOW())`,
  DELETE_COMMENT: `DELETE FROM comments WHERE id = ?`,

  INCREASE_POST_VIEWS: `UPDATE posts SET views = views + 1 WHERE id = ?`,

  POST_GET_LIKES: `SELECT * FROM likes WHERE post_id = ?`,
  POST_CHECK_LIKE: `SELECT * FROM likes WHERE user_id = ? AND post_id = ?`,
  POST_ADD_LIKE: `INSERT INTO likes (user_id, post_id) VALUES (?, ?)`,
  POST_DELETE_LIKE: `DELETE FROM likes WHERE user_id = ? AND post_id = ?`,
  GET_LIKED_POSTS: `SELECT p.id, p.title, u.nick_name FROM likes l INNER JOIN posts p ON l.post_id = p.id INNER JOIN users u ON p.user_id = u.id WHERE l.user_id = ?`,

  GET_POPULAR_POSTS: `WITH TopPosts AS (
           SELECT post_id, COUNT(*) AS like_count
           FROM likes
           GROUP BY post_id
           ORDER BY like_count DESC LIMIT ?
           )
           
           SELECT p.id, p.title, p.category_id, u.nick_name, CONVERT(t.like_count, CHAR) AS like_count
           FROM posts p
           JOIN TopPosts t ON p.id = t.post_id
           JOIN users u ON p.user_id = u.id
           `,
};

module.exports = { QUERY };
