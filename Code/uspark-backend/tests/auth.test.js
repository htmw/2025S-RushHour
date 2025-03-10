require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index.js"); // Import your Express app
const User = require("../Models/User");

let mongoServer;

// Setup an in-memory MongoDB server before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Auth Routes", () => {
  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "testuser@example.com",
      password: "testpassword",
      fullName: "Test User",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("User created successfully");
  });

  it("should not allow duplicate user registration", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "testuser@example.com",
      password: "testpassword",
      fullName: "Test User",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should authenticate an existing user", async () => {
    const res = await request(app).post("/api/auth").send({
      email: "testuser@example.com",
      password: "testpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should handle OAuth login", async () => {
    const res = await request(app).post("/api/auth/oauth").send({
      email: "oauthuser@example.com",
      userId: "oauth-test-id",
      fullName: "OAuth User",
      provider: "google",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
