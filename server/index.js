
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { createUser, getUserByEmail, getAllTasks, createTask, updateTask, deleteTask } = require('./dao');


// starting the app:
const app = express()
app.use(cors())
app.use(express.json())
app.use(passport.initialize());


// ─── PASSPORT LOCAL STRATEGY (Login) ─────────────
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await getUserByEmail(email)
      if (!user) return done(null, false, { message: 'User not found' })
      const match = await bcrypt.compare(password, user.password)
      if (!match) return done(null, false, { message: 'Wrong password' })
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
));



// ─── PASSPORT JWT STRATEGY (Protect Routes) ──────
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      return done(null, { id: payload.id })
    } catch (err) {
      return done(err)
    }
  }
));



// ─── USER ROUTES ──────────────────────────────────

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  try {
    const hashed = await bcrypt.hash(password, 10)
    const user = await createUser(username, email, hashed)
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token })
  }
)

// ─── TASK ROUTES (Protected) ──────────────────────

app.get('/tasks',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const tasks = await getAllTasks(req.user.id)
      res.json(tasks)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

app.post('/tasks',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { title, description } = req.body
    try {
      const task = await createTask(title, description, req.user.id)
      res.json(task)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

app.put('/tasks/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { title, description, completed } = req.body
    try {
      const task = await updateTask(req.params.id, title, description, completed)
      res.json(task)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

app.delete('/tasks/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await deleteTask(req.params.id)
      res.json({ message: 'Task deleted' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// ─── START SERVER ─────────────────────────────────

app.listen(3000, () => console.log('Server running on port 3000'))