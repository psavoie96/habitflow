const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    // later add userId to scope habits per user
    name: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

// Example: if you add userId later, this prevents duplicate names per user
// habitSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Habit", habitSchema);
