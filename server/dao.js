
const pool = require('./db')

// ─── USERS ───────────────────────────────────────
const createUser = async (username, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
    [username, email, hashedPassword]
  )
  return result.rows[0]
};
/* instead of just inserting silently, PostgreSQL sends back those specific columns of the newly created row. 
This is how you get the auto-generated id and created_at without making a second query */

/*pool.query() always returns an object with a rows array containing the results. Since we
 inserted one user, we grab rows[0] — the first (and only) row — and return it */

 // { id: 1, username: 'Alireza', email: 'ali@example.com', created_at: '2026-04-17T...' }

/* Notice in createUser we return everything except the password 
— never send the hashed password back to the client */


const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0]
};
// It fetches the full user object from the DB including the hashed password.
// Then in Local Strategy -> 1. get user by email 2. copare password (bcrypt.compare())
// We only query by email in the DB because passwords are hashed — you can't search by password in SQL.
// The token is generated in index.js right after Passport verifies the login






// ─── TASKS ───────────────────────────────────────
const getAllTasks = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [user_id]
  )
  return result.rows
};

const createTask = async (title, description, user_id) => {
  const result = await pool.query(
    'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
    [title, description, user_id]
  )
  return result.rows[0]
};

const updateTask = async (id, title, description, completed) => {
  const result = await pool.query(
    'UPDATE tasks SET title=$1, description=$2, completed=$3 WHERE id=$4 RETURNING *',
    [title, description, completed, id]
  )
  return result.rows[0]
};

const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id])
};

module.exports = { createUser, getUserByEmail, getAllTasks, createTask, updateTask, deleteTask }