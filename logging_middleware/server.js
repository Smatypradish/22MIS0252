// ============================================
// Logging Middleware - Express Server
// ============================================
// This is the entry point for the logging middleware question.
// The actual middleware logic will be added based on the evaluation question.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Built-in Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Custom Logging Middleware ---
// TODO: Implement logging middleware based on the evaluation question
// Middleware goes here ↓


// --- Routes ---
// TODO: Add routes as needed based on the evaluation question

app.get("/", (req, res) => {
  res.json({ message: "Logging Middleware Server is running!" });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Logging Middleware Server running on http://localhost:${PORT}`);
});
