// ============================================
// Notification Controller
// ============================================
// Handles HTTP request/response logic.
// Calls the service layer for business logic.

const notificationService = require("../services/notificationService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

/**
 * GET /api/notifications
 * Fetches notifications from external API, prioritizes them,
 * and returns the top 10 sorted by priority + recency.
 */
async function getTopNotifications(req, res, next) {
  try {
    const result = await notificationService.getTopNotifications();

    return successResponse(res, 200, result.notifications, "Top 10 notifications fetched successfully");
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
}

/**
 * GET /api/notifications/all
 * Fetches ALL notifications from external API with priority assigned (no limit).
 */
async function getAllNotifications(req, res, next) {
  try {
    const rawNotifications = await notificationService.fetchNotificationsFromAPI();
    const withPriority = notificationService.assignPriority(rawNotifications);
    const sorted = notificationService.sortByPriorityAndRecency(withPriority);

    return successResponse(res, 200, sorted, "All notifications fetched successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/notifications/type/:type
 * Fetches notifications filtered by type (placement, result, event).
 */
async function getNotificationsByType(req, res, next) {
  try {
    const { type } = req.params;
    const validTypes = ["placement", "result", "event"];

    // Validate the type parameter
    if (!validTypes.includes(type.toLowerCase())) {
      return errorResponse(res, 400, `Invalid type. Must be one of: ${validTypes.join(", ")}`);
    }

    const rawNotifications = await notificationService.fetchNotificationsFromAPI();
    const withPriority = notificationService.assignPriority(rawNotifications);

    // Filter by requested type
    const filtered = withPriority.filter(
      (n) => (n.type || "").toLowerCase() === type.toLowerCase()
    );

    // Sort by recency (newest first)
    const sorted = notificationService.sortByPriorityAndRecency(filtered);

    return successResponse(res, 200, sorted, `${type} notifications fetched successfully`);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTopNotifications,
  getAllNotifications,
  getNotificationsByType,
};
