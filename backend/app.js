const express = require("express");
const cors = require("cors");
const habitRoutes = require("./src/routes/habitRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/habits", habitRoutes);

module.exports = app;