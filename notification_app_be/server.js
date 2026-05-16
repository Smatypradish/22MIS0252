// ============================================
// Notification App — Express Backend Server
// ============================================
// Entry point for the Notification App backend.
// Integrates: logging middleware, routes, error handling.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import middleware
const loggingMiddleware = require("./middleware/loggingMiddleware");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const PORT = process.env.PORT || 3002;

// --- Built-in Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Custom Logging Middleware ---
app.use(loggingMiddleware);

// --- Routes ---
app.use("/api/notifications", notificationRoutes);

// --- Health Check ---
app.get("/", (req, res) => {
  res.json({
    message: "Notification App Backend is running!",
    endpoints: {
      topNotifications: "GET /api/notifications",
      allNotifications: "GET /api/notifications/all",
      byType: "GET /api/notifications/type/:type",
    },
  });
});

// --- Global Error Handler (must be last) ---
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`  Notification Backend running on:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`===========================================`);
  console.log(`\n  Available endpoints:`);
  console.log(`  GET  /api/notifications          → Top 10 prioritized`);
  console.log(`  GET  /api/notifications/all       → All notifications`);
  console.log(`  GET  /api/notifications/type/:type → Filter by type`);
  console.log(`\n  Priority order: placement > result > event\n`);
});
