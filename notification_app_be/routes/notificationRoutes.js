// ============================================
// Notification Routes
// ============================================
// Maps URL paths to controller functions.

const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// GET /api/notifications — Top 10 prioritized notifications
router.get("/", notificationController.getTopNotifications);

// GET /api/notifications/all — All notifications (no limit)
router.get("/all", notificationController.getAllNotifications);

// GET /api/notifications/type/:type — Filter by type (placement, result, event)
router.get("/type/:type", notificationController.getNotificationsByType);

module.exports = router;
