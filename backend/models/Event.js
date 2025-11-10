const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // "habit_created", "habit_toggled", etc.
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
    metadata: { type: Object, default: {} },
    at: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

eventSchema.index({ type: 1, at: -1 });

module.exports = mongoose.model("Event", eventSchema);
