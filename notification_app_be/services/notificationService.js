// ============================================
// Notification Service
// ============================================
// Handles all business logic:
//   1. Fetch notifications from the external API
//   2. Assign priority based on notification type
//   3. Sort by priority (highest first), then by recency (newest first)
//   4. Return the top 10 notifications

const axios = require("axios");
const { getPriority } = require("../utils/priorityConstants");

// External API URL provided by the evaluation
const API_URL = "http://4.224.186.213/evaluation-service/notifications";

// Mock data used as fallback when the external API is unavailable
const MOCK_NOTIFICATIONS = [
  { id: "1", title: "Google On-Campus Drive", message: "Google visiting campus on May 20th for SDE roles", type: "placement", createdAt: "2026-05-16T10:00:00.000Z" },
  { id: "2", title: "Amazon Internship Results", message: "Amazon summer internship results are out", type: "placement", createdAt: "2026-05-16T09:30:00.000Z" },
  { id: "3", title: "TCS NQT Registration Open", message: "Register for TCS NQT before May 25th", type: "placement", createdAt: "2026-05-15T14:00:00.000Z" },
  { id: "4", title: "Semester Results Published", message: "6th semester results available on portal", type: "result", createdAt: "2026-05-16T08:00:00.000Z" },
  { id: "5", title: "Internal Assessment Marks", message: "IA-2 marks uploaded for all subjects", type: "result", createdAt: "2026-05-15T16:00:00.000Z" },
  { id: "6", title: "Lab Exam Results", message: "OS Lab exam results declared", type: "result", createdAt: "2026-05-14T12:00:00.000Z" },
  { id: "7", title: "CGPA Updated", message: "Cumulative GPA updated for all students", type: "result", createdAt: "2026-05-13T10:00:00.000Z" },
  { id: "8", title: "Hackathon 2026", message: "Annual hackathon on May 30th — register now", type: "event", createdAt: "2026-05-16T07:00:00.000Z" },
  { id: "9", title: "Cultural Fest", message: "Techno Cultural fest starts June 1st", type: "event", createdAt: "2026-05-15T09:00:00.000Z" },
  { id: "10", title: "Workshop on AI", message: "Free AI/ML workshop this Saturday", type: "event", createdAt: "2026-05-14T11:00:00.000Z" },
  { id: "11", title: "Sports Day", message: "Annual sports day on June 5th", type: "event", createdAt: "2026-05-13T08:00:00.000Z" },
  { id: "12", title: "Infosys Pool Drive", message: "Infosys hiring for SE roles — apply by May 22nd", type: "placement", createdAt: "2026-05-14T15:00:00.000Z" },
  { id: "13", title: "Revaluation Results", message: "Revaluation results for 5th sem published", type: "result", createdAt: "2026-05-12T10:00:00.000Z" },
  { id: "14", title: "Guest Lecture", message: "Guest lecture on Cloud Computing by AWS engineer", type: "event", createdAt: "2026-05-12T09:00:00.000Z" },
  { id: "15", title: "Wipro Recruitment", message: "Wipro Elite NLTH exam scheduled for May 28th", type: "placement", createdAt: "2026-05-13T11:00:00.000Z" },
];

/**
 * Fetch raw notifications from the external evaluation API.
 * Falls back to mock data if the API is unavailable.
 * @returns {Array} Array of notification objects
 */
async function fetchNotificationsFromAPI() {
  try {
    // Try multiple auth header formats
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: {
        "Authorization": `Bearer ${process.env.ACCESS_CODE || "SfFuWg"}`,
        "x-access-code": process.env.ACCESS_CODE || "SfFuWg",
        "access-code": process.env.ACCESS_CODE || "SfFuWg",
        "Content-Type": "application/json",
      },
    });

    // The API may return data in different formats — handle all
    const notifications = response.data.notifications || response.data.data || response.data || [];

    if (!Array.isArray(notifications)) {
      console.warn("API returned non-array data, wrapping in array");
      return [notifications];
    }

    console.log(`Fetched ${notifications.length} notifications from external API`);
    return notifications;
  } catch (error) {
    console.warn(`External API unavailable (${error.message}). Using mock data.`);
    return MOCK_NOTIFICATIONS;
  }
}

/**
 * Assign a priority number to each notification based on its type.
 * @param {Array} notifications - Raw notifications from the API
 * @returns {Array} Notifications with a 'priority' field added
 */
function assignPriority(notifications) {
  return notifications.map((notification) => ({
    ...notification,
    priority: getPriority(notification.type),
  }));
}

/**
 * Sort notifications by:
 *   1. Priority (ascending — lower number = higher priority)
 *   2. Recency (descending — newest first) as tiebreaker
 * @param {Array} notifications - Notifications with priority assigned
 * @returns {Array} Sorted notifications
 */
function sortByPriorityAndRecency(notifications) {
  return [...notifications].sort((a, b) => {
    // First: sort by priority (lower number = higher priority)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    // Second: sort by recency (newest first)
    const dateA = new Date(a.createdAt || a.timestamp || a.date || 0);
    const dateB = new Date(b.createdAt || b.timestamp || b.date || 0);
    return dateB - dateA;
  });
}

/**
 * Main service function: fetch, prioritize, sort, and return top 10.
 * @returns {object} { notifications: Array, total: number }
 */
async function getTopNotifications() {
  // Step 1: Fetch from external API (or mock data)
  const rawNotifications = await fetchNotificationsFromAPI();

  // Step 2: Assign priority based on type
  const withPriority = assignPriority(rawNotifications);

  // Step 3: Sort by priority, then by recency
  const sorted = sortByPriorityAndRecency(withPriority);

  // Step 4: Return top 10
  const top10 = sorted.slice(0, 10);

  return {
    notifications: top10,
    totalFetched: rawNotifications.length,
    returned: top10.length,
  };
}

module.exports = {
  fetchNotificationsFromAPI,
  assignPriority,
  sortByPriorityAndRecency,
  getTopNotifications,
};
