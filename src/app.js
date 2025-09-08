const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Helper: generar id y token sencillo
function genId() {
  return Date.now().toString();
}

// Base de datos simulada en memoria para la prueba 
const users = [];
const findUser = (username) => users.find(u => u.username === username);

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
      passwordHash: hashed
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
})

let tokensActivos = [];

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
  tokensActivos.push(token);
  return res.status(200).json({ token });
});

// verificar token
function autenticar(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Falta token" });

  const token = authHeader.replace("Bearer ", "");
  if (!tokensActivos.includes(token)) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }

  req.token = token;
  next();
}

// Logout
app.post("/api/logout", autenticar, (req, res) => {
  tokensActivos = tokensActivos.filter((t) => t !== req.token);
  res.json({ message: "Sesión cerrada correctamente" });
});

// Endpoint protegido
app.get("/api/protegido", autenticar, (req, res) => {
  res.json({ message: "Accediste a un endpoint protegido ✅" });
});


module.exports = app;