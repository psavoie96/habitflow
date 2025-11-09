const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Habit API", () => {
  it("POST /api/habits creates a habit", async () => {
    const res = await request(app)
      .post("/api/habits")
      .send({ name: "Drink water" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Drink water");
  });

  it("GET /api/habits returns habits", async () => {
    const res = await request(app).get("/api/habits");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
