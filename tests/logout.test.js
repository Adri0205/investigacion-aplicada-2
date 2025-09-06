const request = require("supertest");
const app = require("../src/logout");

describe("Pruebas de login y logout", () => {
  let token = "";

  test("Login exitoso devuelve token", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "usuario", password: "1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Acceso con token válido", async () => {
    const res = await request(app)
      .get("/api/usuario")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
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
      .get("/api/usuario")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });
});
