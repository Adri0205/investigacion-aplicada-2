const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let tokensActivos = [];

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "usuario" && password === "1234") {
    const token = `token_${Date.now()}`;
    tokensActivos.push(token);
    return res.json({ message: "Login exitoso", token });
  }
  return res.status(401).json({ error: "Credenciales inválidas" });
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

// Endpoint protegido
app.get("/api/usuario", autenticar, (req, res) => {
  res.json({ message: "Accediste a un endpoint protegido ✅" });
});

// Logout
app.post("/api/logout", autenticar, (req, res) => {
  tokensActivos = tokensActivos.filter((t) => t !== req.token);
  res.json({ message: "Sesión cerrada correctamente" });
});

module.exports = app;
