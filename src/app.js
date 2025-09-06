const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Base de datos simulada en memoria para la prueba 
const users = [{
  username: "Adri",
  passwordHash: "$2a$10$u5HYpmRwn2b3KJQieGxXV.Zu7oaZ9gImwekieeFLrFGc2/JJvNzIK"
}];
const findUser = (username) => users.find(u => u.username === username);


// POST /api/login Caso de prueba 2
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }
  const user = findUser(username);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const secret = process.env.JWT_SECRET || 'devsecret';
  const token = jwt.sign({ sub: user.id, username: user.username }, secret, { expiresIn: '1h' });
  return res.status(200).json({ token });
});

module.exports = app;
