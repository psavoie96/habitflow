// server.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB || "habitflow",
  });
  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  }
}

start().catch((e) => {
  console.error("Mongo connection error:", e);
  process.exit(1);
});

module.exports = app; // export for tests
