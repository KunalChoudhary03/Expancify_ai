const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

let mongoServer;

const baseUser = {
  username: "kunal01",
  email: "kunal01@example.com",
  password: "secret123",
  fullName: {
    firstName: "Kunal",
    lastName: "Choudhary",
  },
};

describe("Auth API tests", () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = "test-secret-key";
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  test("register should create user", async () => {
    const res = await request(app).post("/api/auth/register").send(baseUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("register should return 409 for duplicate email", async () => {
    await request(app).post("/api/auth/register").send(baseUser);

    const res = await request(app).post("/api/auth/register").send({
      ...baseUser,
      username: "anotheruser",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("User already exists");
  });

  test("login should return token for valid credentials", async () => {
    await request(app).post("/api/auth/register").send(baseUser);

    const res = await request(app).post("/api/auth/login").send({
      email: baseUser.email,
      password: baseUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.token.length).toBeGreaterThan(10);
  });

  test("login should return 401 for invalid password", async () => {
    await request(app).post("/api/auth/register").send(baseUser);

    const res = await request(app).post("/api/auth/login").send({
      email: baseUser.email,
      password: "wrong-password",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Alert: Invalid password");
  });

  test("profile should return user data with valid token", async () => {
    await request(app).post("/api/auth/register").send(baseUser);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: baseUser.email,
      password: baseUser.password,
    });

    const profileRes = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(profileRes.statusCode).toBe(200);
    expect(profileRes.body.user.email).toBe(baseUser.email);
    expect(profileRes.body.user).not.toHaveProperty("password");
  });

  test("profile should return 401 without token", async () => {
    const res = await request(app).get("/api/auth/profile");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Please Login first");
  });

  test("logout should return 200 with valid token", async () => {
    await request(app).post("/api/auth/register").send(baseUser);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: baseUser.email,
      password: baseUser.password,
    });

    const logoutRes = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.message).toBe("Logout successful");
  });
});
