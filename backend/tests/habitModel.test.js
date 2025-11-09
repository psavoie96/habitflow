const mongoose = require("mongoose");
const Habit = require("../src/models/Habit");

describe("Habit model", () => {
  it("creates a habit with default values", () => {
    const habit = new Habit({ name: "Workout" });
    expect(habit.name).toBe("Workout");
    expect(habit.completed).toBe(false);
  });
});
