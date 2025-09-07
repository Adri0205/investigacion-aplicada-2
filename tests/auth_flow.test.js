const request = require('supertest');
const app = require('../app');

describe('Flujo auth: login, protected, logout', () => {
  beforeEach(async () => {
    app.users.length = 0;
    app.tokens.clear();

    // registrar un usuario para los tests de login
    await request(app).post('/api/register').send({
      username: 'testuser',
      password: 'miPass123',
      email: 'test@example.com'
    });
  });

  test('Login devuelve token y permite acceder a recurso protegido, luego logout lo invalida', async () => {
    // login
    const loginRes = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'testuser', password: 'miPass123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    const token = loginRes.body.token;

    // acceder recurso protegido
    const prot = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(prot.status).toBe(200);
    expect(prot.body).toHaveProperty('message');
    expect(prot.body.message).toMatch(/Hola testuser/);

    // logout
    const out = await request(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(out.status).toBe(200);

    // intentar acceder otra vez con el mismo token => 401
    const prot2 = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(prot2.status).toBe(401);
  });

  test('Login con credenciales inválidas devuelve 401', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'testuser', password: 'wrong' });

    expect(res.status).toBe(401);
  });
});