// ============================================
// Response Helper
// ============================================
// Standardizes all API responses into a consistent format.

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {object} data - Response data
 * @param {string} message - Optional success message
 */
function successResponse(res, statusCode, data, message = "Success") {
  return res.status(statusCode).json({
    success: true,
    message,
    count: Array.isArray(data) ? data.length : undefined,
    data,
  });
}

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error message
 */
function errorResponse(res, statusCode, error) {
  return res.status(statusCode).json({
    success: false,
    error,
  });
}

module.exports = { successResponse, errorResponse };
