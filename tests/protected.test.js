const request = require("supertest");
const app = require("../src/app");

describe("Caso de prueba 3: Verificar el acceso a un recurso protegido", () => {
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

    test("Acceso sin token debería devolver 401", async () => { 
        const res = await request(app).get("/api/protegido");
        expect(res.statusCode).toBe(401);
    });

    test("Acceso con token válido debería devolver 200", async () => {
        const res = await request(app)
            .get("/api/protegido")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Accediste a un endpoint protegido ✅");
    });
});