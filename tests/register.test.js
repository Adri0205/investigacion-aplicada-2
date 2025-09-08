const request = require('supertest');
const app = require("../src/app");

describe('Caso de prueba 1: Verificar el registro de usuario', () => {
  

  test('Debería registrar un usuario correctamente y devolver 201 y datos (sin password)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'nuevo_usuario',
        password: 'password_seguro',
        email: 'correo@ejemplo.com',
      });

    // verificaciones
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuario creado');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('username', 'nuevo_usuario');
    expect(res.body.user).toHaveProperty('email', 'correo@ejemplo.com');
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('Registro con campos faltantes devuelve 400', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'incompleto',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Faltan campos obligatorios');
  });

  test('Registro duplicado devuelve 409', async () => {
    // primer registro
    await request(app).post('/api/register').send({
      username: 'repetido',
      password: '123456',
      email: 'repe@ejemplo.com',
    });

    // intento duplicado
    const res = await request(app).post('/api/register').send({
      username: 'repetido',
      password: '123456',
      email: 'repe@ejemplo.com',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'Usuario o email ya existe');
  });
});
