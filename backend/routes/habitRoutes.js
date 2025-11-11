const express = require("express");
const router = express.Router();

const Habit = require("../models/Habit");
const AnalyticsEvent = require("../models/AnalyticsEvent");

const Joi = require("joi");
const validate = require("../middlewares/validate");

const createHabitSchema = Joi.object({
  name: Joi.string().min(1).max(80).required(),
});

// GET all habits
router.get("/", async (req, res, next) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (e) {
    next(e);
  }
});

// POST new habit (single, validated route)
router.post("/", validate(createHabitSchema), async (req, res, next) => {
  try {
    const savedHabit = await Habit.create({ name: req.body.name });

    // Emit an analytics event (pick ONE of the two approaches below):

    // Option A: wait for the event to persist (simple, consistent)
    await AnalyticsEvent.create({ type: "habit_created", habitId: savedHabit._id });

    // Option B: fire-and-forget so API response isn’t delayed
    // Event.create({ type: "habit_created", habitId: savedHabit._id }).catch((err) =>
    //   req.log ? req.log.warn({ err }, "event_write_failed") : console.warn("event_write_failed", err)
    // );

    res.status(201).json(savedHabit);
  } catch (e) {
    next(e);
  }
});

// DELETE habit
router.delete("/:id", async (req, res, next) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    // Optional analytics:
    // Event.create({ type: "habit_deleted", habitId: req.params.id }).catch(() => {});
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

// TOGGLE completion
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Not found" });

    habit.completed = !habit.completed;
    await habit.save();

    // Optional analytics:
    // await Event.create({ type: "habit_toggled", habitId: habit._id, metadata: { completed: habit.completed } });

    res.json(habit);
  } catch (e) {
    next(e);
  }
});

// GET /api/habits/stats
router.get("/stats", async (req, res, next) => {
  try {
    const total = await Habit.countDocuments();
    const completed = await Habit.countDocuments({ completed: true });
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    res.json({ total, completed, completionRate });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
