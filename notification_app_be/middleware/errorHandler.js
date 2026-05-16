// ============================================
// Error Handling Middleware
// ============================================
// Catches any unhandled errors and sends a clean JSON response.

/**
 * Global error handler middleware.
 * Must have 4 parameters (err, req, res, next) for Express to recognize it.
 */
function errorHandler(err, req, res, next) {
  const timestamp = new Date().toISOString();

  // Log the error details to console
  console.error(`[${timestamp}] ERROR: ${err.message}`);
  console.error(err.stack);

  // Send error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
