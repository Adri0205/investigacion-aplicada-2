const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app.js");

describe("GET /api/protected-resource", () => {
  const secret = process.env.JWT_SECRET || "devsecret";
  const tokenValido = jwt.sign({ username: "Adri" }, secret, { expiresIn: "1h" });

  it("✅ Debería permitir acceso con un token válido", async () => {
    const res = await request(app)
      .get("/api/protected-resource")
      .set("Authorization", `Bearer ${tokenValido}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data", "Este es el recurso protegido");
  });

  it(" Debería negar acceso sin token", async () => {
    const res = await request(app).get("/api/protected-resource");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Token requerido");
  });

  it(" Debería negar acceso con token inválido", async () => {
    const res = await request(app)
      .get("/api/protected-resource")
      .set("Authorization", "Bearer token_invalido");

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error", "Token inválido");
  });
});