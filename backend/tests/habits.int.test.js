const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(uri, { dbName: "habitflow_test" });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Habits API", () => {
  it("creates and lists habits", async () => {
    const create = await request(app).post("/api/habits").send({ name: "Workout" });
    expect(create.status).toBe(201);

    const list = await request(app).get("/api/habits");
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body[0].name).toBe("Workout");
  });
});
