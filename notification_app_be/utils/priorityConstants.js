// ============================================
// Priority Constants
// ============================================
// Defines priority levels for different notification types.
// Lower number = higher priority.

const PRIORITY_MAP = {
  placement: 1, // Highest priority — job/placement related
  result: 2,    // Medium priority — exam results
  event: 3,     // Lower priority — college events
};

// Default priority for unknown types
const DEFAULT_PRIORITY = 99;

/**
 * Get the priority number for a notification type.
 * @param {string} type - The notification type (e.g., "placement", "result", "event")
 * @returns {number} Priority number (lower = higher priority)
 */
function getPriority(type) {
  if (!type) return DEFAULT_PRIORITY;
  return PRIORITY_MAP[type.toLowerCase()] || DEFAULT_PRIORITY;
}

module.exports = { PRIORITY_MAP, DEFAULT_PRIORITY, getPriority };
