require("dotenv").config();
const request = require("supertest");

const BASE_URL = process.env.BASE_URL || "http://localhost:5001"; // Use staging URL if set
console.log(`🌍 Base URL: ${BASE_URL}`);
describe("Auth Routes", () => {
  it("should sign up a new user", async () => {
    const res = await request(BASE_URL)
      .post("/auth/signup")
      .send({
        email: `testuser_${Date.now()}@example.com`,
        password: "testpassword",
        fullName: "Test User",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("User created successfully");
  });

  it("should not allow duplicate user registration", async () => {
    const res = await request(BASE_URL).post("/auth/signup").send({
      email: "testuser@example.com",
      password: "testpassword",
      fullName: "Test User",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should authenticate an existing user", async () => {
    const res = await request(BASE_URL).post("/auth/login").send({
      email: "testuser@example.com",
      password: "testpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(BASE_URL).post("/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should handle OAuth login", async () => {
    const res = await request(BASE_URL).post("/auth/oauth").send({
      email: "oauthuser@example.com",
      userId: "oauth-test-id",
      fullName: "OAuth User",
      provider: "google.com",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
