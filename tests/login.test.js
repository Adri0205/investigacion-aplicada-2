const request = require('supertest');
const app = require('../src/app');

//Verificar el inicio de sesión de usuario. Requisitos: POST /api/login -> 200 y token en la respuesta. (usuario y contraseña son provisionales)
describe('Caso de prueba 2: Verificar inicio de sesión', () => {
  test('debe responder 200 y contener un token de autenticación', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'Adri',
        password: 'chocobollo'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    console.log('token de la respuesta', res.body.token);
  });
});
