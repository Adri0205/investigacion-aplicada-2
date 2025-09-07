// src/app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// "DB" en memoria: expuestas en app para que los tests puedan limpiar/leer
const users = [];
const tokens = new Map();
app.users = users;
app.tokens = tokens;

// Helper: generar id y token sencillo
function genId() {
  return Date.now().toString();
}
function genToken() {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * POST /api/register
 */
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const exists = users.find(u => u.username === username || u.email === email);
    if (exists) {
      return res.status(409).json({ message: 'Usuario o email ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = {
      id: genId(),
      username,
      email,
      password: hashed
    };

    users.push(newUser);

    return res.status(201).json({
      message: 'Usuario creado',
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    console.error('Error /api/register:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

/**
 * POST /api/login
 */
app.post('/api/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const user = users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = genToken();
    tokens.set(token, user.id);

    return res.status(200).json({ message: 'Autenticado', token });
  } catch (err) {
    console.error('Error /api/login:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// middleware auth
function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  const token = auth.slice(7);
  const userId = tokens.get(token);
  if (!userId) return res.status(401).json({ message: 'Token inválido' });
  req.userId = userId;
  next();
}

/**
 * GET /api/protected
 */
app.get('/api/protected', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json({ message: `Hola ${user.username}, este es un recurso protegido` });
});

/**
 * POST /api/logout
 */
app.post('/api/logout', authMiddleware, (req, res) => {
  const auth = req.headers['authorization'];
  const token = auth.slice(7);
  tokens.delete(token);
  res.json({ message: 'Sesión cerrada' });
});

module.exports = app;