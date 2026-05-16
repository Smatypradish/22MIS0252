// ============================================
// Logging Middleware
// ============================================
// Logs every incoming HTTP request with method, URL, status code, and response time.

/**
 * Middleware that logs request details to the console.
 * Attaches to the response 'finish' event to capture the status code.
 */
function loggingMiddleware(req, res, next) {
  const start = Date.now();

  // Log when the response is sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    // Color-code status: green for 2xx, yellow for 4xx, red for 5xx
    let statusColor;
    if (status >= 500) statusColor = "\x1b[31m"; // Red
    else if (status >= 400) statusColor = "\x1b[33m"; // Yellow
    else statusColor = "\x1b[32m"; // Green

    console.log(
      `[${timestamp}] ${method} ${url} ${statusColor}${status}\x1b[0m ${duration}ms`
    );
  });

  next();
}

module.exports = loggingMiddleware;
