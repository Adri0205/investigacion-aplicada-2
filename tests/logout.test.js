const request = require("supertest");
const app = require("../src/app");

describe("Caso de prueba 4: Verificar el cierre de sesión de usuario ", () => {
  let token = "";

  beforeAll(async () => {
      await request(app)
      .post('/api/register')
      .send({
        username: 'Adri',
        password: 'chocobollo',
        email: 'adri@example.com'
      });

    const res = await request(app)
      .post("/api/login")
      .send({ username: "Adri", password: "chocobollo" });
    token = res.body.token;
  });

  test("Logout invalida el token", async () => {
    const res = await request(app)
      .post("/api/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sesión cerrada correctamente");
  });

  test("Token inválido después de logout", async () => {
    const res = await request(app)
      .get("/api/protegido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });
});