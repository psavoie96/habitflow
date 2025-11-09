const express = require("express");
const Habit = require("../models/Habit");
const router = express.Router();


// GET all habits
router.get("/", async (req, res) => {
  const habits = await Habit.find();
  res.json(habits);
});

// POST new habit
router.post("/", async (req, res) => {
  const newHabit = new Habit({ name: req.body.name });
  const savedHabit = await newHabit.save();
  res.status(201).json(savedHabit);
});

// DELETE habit
router.delete("/:id", async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// TOGGLE completion
router.patch("/:id/toggle", async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  habit.completed = !habit.completed;
  await habit.save();
  res.json(habit);
});


// GET /api/habits/stats
router.get("/stats", async (req, res) => {
  try {
    const total = await Habit.countDocuments();
    const completed = await Habit.countDocuments({ completed: true });
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      completionRate,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});


module.exports = router;