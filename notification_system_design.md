# Stage 1 — Notification System Design

## 1. Overview

This document defines the REST API design for a **Notification System** that allows users to receive, view, manage, and get real-time notifications. The system follows RESTful conventions with JSON payloads.

---

## 2. Base URL

```
http://localhost:3002/api
```

### Common Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes (POST/PUT/PATCH) |
| `Accept` | `application/json` | Yes |

---

## 3. Notification JSON Schema

### Notification Object

```json
{
  "id": "string (UUID)",
  "title": "string",
  "message": "string",
  "type": "string (info | success | warning | error)",
  "isRead": "boolean",
  "createdAt": "string (ISO 8601 timestamp)",
  "updatedAt": "string (ISO 8601 timestamp)"
}
```

### Example

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "New Login Detected",
  "message": "A new login was detected from Chrome on Windows.",
  "type": "warning",
  "isRead": false,
  "createdAt": "2026-05-16T17:00:00.000Z",
  "updatedAt": "2026-05-16T17:00:00.000Z"
}
```

---

## 4. API Endpoints

### 4.1 GET `/api/notifications` — Get All Notifications

Retrieves a list of all notifications, with optional filtering.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | — | Filter by type (`info`, `success`, `warning`, `error`) |
| `isRead` | boolean | — | Filter by read status (`true` or `false`) |

**Request:**

```
GET /api/notifications?isRead=false
```

**Response — 200 OK:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "New Login Detected",
      "message": "A new login was detected from Chrome on Windows.",
      "type": "warning",
      "isRead": false,
      "createdAt": "2026-05-16T17:00:00.000Z",
      "updatedAt": "2026-05-16T17:00:00.000Z"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "title": "Welcome!",
      "message": "Welcome to the Notification System.",
      "type": "info",
      "isRead": false,
      "createdAt": "2026-05-16T16:30:00.000Z",
      "updatedAt": "2026-05-16T16:30:00.000Z"
    }
  ]
}
```

---

### 4.2 GET `/api/notifications/:id` — Get Single Notification

Retrieves a single notification by its ID.

**Request:**

```
GET /api/notifications/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response — 200 OK:**

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "New Login Detected",
    "message": "A new login was detected from Chrome on Windows.",
    "type": "warning",
    "isRead": false,
    "createdAt": "2026-05-16T17:00:00.000Z",
    "updatedAt": "2026-05-16T17:00:00.000Z"
  }
}
```

**Response — 404 Not Found:**

```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

### 4.3 POST `/api/notifications` — Create a Notification

Creates a new notification.

**Request Body:**

```json
{
  "title": "System Update",
  "message": "The system will undergo maintenance at 2:00 AM.",
  "type": "info"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | Yes | 1–100 characters |
| `message` | string | Yes | 1–500 characters |
| `type` | string | No | One of: `info`, `success`, `warning`, `error`. Default: `info` |

**Response — 201 Created:**

```json
{
  "success": true,
  "data": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "title": "System Update",
    "message": "The system will undergo maintenance at 2:00 AM.",
    "type": "info",
    "isRead": false,
    "createdAt": "2026-05-16T17:05:00.000Z",
    "updatedAt": "2026-05-16T17:05:00.000Z"
  }
}
```

**Response — 400 Bad Request:**

```json
{
  "success": false,
  "error": "Title and message are required"
}
```

---

### 4.4 PATCH `/api/notifications/:id/read` — Mark as Read

Marks a single notification as read.

**Request:**

```
PATCH /api/notifications/a1b2c3d4-e5f6-7890-abcd-ef1234567890/read
```

**Response — 200 OK:**

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "New Login Detected",
    "message": "A new login was detected from Chrome on Windows.",
    "type": "warning",
    "isRead": true,
    "createdAt": "2026-05-16T17:00:00.000Z",
    "updatedAt": "2026-05-16T17:10:00.000Z"
  }
}
```

**Response — 404 Not Found:**

```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

### 4.5 PATCH `/api/notifications/read-all` — Mark All as Read

Marks all unread notifications as read.

**Request:**

```
PATCH /api/notifications/read-all
```

**Response — 200 OK:**

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "modifiedCount": 5
}
```

---

### 4.6 DELETE `/api/notifications/:id` — Delete a Notification

Deletes a single notification by ID.

**Request:**

```
DELETE /api/notifications/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response — 200 OK:**

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

**Response — 404 Not Found:**

```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

## 5. Status Codes Summary

| Code | Meaning | Used For |
|------|---------|----------|
| `200` | OK | Successful GET, PATCH, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Missing or invalid fields |
| `404` | Not Found | Notification ID does not exist |
| `500` | Internal Server Error | Unexpected server failure |

---

## 6. Real-Time Notifications — Server-Sent Events (SSE)

### Why SSE over WebSocket?

| Feature | SSE | WebSocket |
|---------|-----|-----------|
| Direction | Server → Client (one-way) | Bidirectional |
| Complexity | Simple (uses HTTP) | More complex (separate protocol) |
| Reconnection | Built-in auto-reconnect | Manual implementation needed |
| Best for | Notifications, live feeds | Chat, gaming, collaborative editing |

> **Choice: SSE** — Notifications are server-to-client only. SSE is simpler, works over standard HTTP, and auto-reconnects on disconnection.

### SSE Endpoint

```
GET /api/notifications/stream
```

**Headers:**

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Event Format:**

```
event: new-notification
data: {"id":"c3d4e5f6","title":"System Update","message":"Maintenance at 2AM","type":"info","isRead":false,"createdAt":"2026-05-16T17:05:00.000Z"}

event: notification-read
data: {"id":"a1b2c3d4","isRead":true}

event: notification-deleted
data: {"id":"a1b2c3d4"}
```

### Client-Side Usage (React)

```javascript
useEffect(() => {
  const eventSource = new EventSource("/api/notifications/stream");

  eventSource.addEventListener("new-notification", (event) => {
    const notification = JSON.parse(event.data);
    // Add to state
  });

  eventSource.addEventListener("notification-read", (event) => {
    const { id } = JSON.parse(event.data);
    // Update read status in state
  });

  eventSource.addEventListener("notification-deleted", (event) => {
    const { id } = JSON.parse(event.data);
    // Remove from state
  });

  return () => eventSource.close();
}, []);
```

---

## 7. Data Flow Diagram

```
┌──────────────┐    POST /api/notifications    ┌──────────────────┐
│              │ ─────────────────────────────► │                  │
│   React      │    GET /api/notifications     │   Express        │
│   Frontend   │ ◄───────────────────────────── │   Backend        │
│   (Port 5173)│    SSE /stream (real-time)    │   (Port 3002)    │
│              │ ◄━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │                  │
└──────────────┘                                └──────────────────┘
                                                       │
                                                       ▼
                                                ┌──────────────────┐
                                                │  In-Memory Array │
                                                │  (Data Store)    │
                                                └──────────────────┘
```

---

## 8. API Endpoints Summary Table

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Get all notifications (with filters) |
| `GET` | `/api/notifications/:id` | Get single notification |
| `POST` | `/api/notifications` | Create new notification |
| `PATCH` | `/api/notifications/:id/read` | Mark one as read |
| `PATCH` | `/api/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/notifications/:id` | Delete a notification |
| `GET` | `/api/notifications/stream` | SSE real-time stream |

---
---

# Stage 2 — Database Design & Scaling Strategy

## 1. Database Choice: MongoDB (NoSQL)

### Why MongoDB?

| Factor | MongoDB | SQL (PostgreSQL/MySQL) |
|--------|---------|----------------------|
| **Schema flexibility** | Schema-less — easy to add fields like `metadata`, `priority` later | Requires ALTER TABLE migrations |
| **Write-heavy workload** | Optimized for high-volume inserts (notifications are write-heavy) | Slower under heavy write load |
| **JSON-native** | Stores BSON (binary JSON) — maps directly to our API response format | Requires ORM or manual mapping |
| **Horizontal scaling** | Built-in sharding support | Complex to shard |
| **TTL (auto-delete)** | Built-in TTL indexes to auto-expire old notifications | Requires cron jobs or manual cleanup |
| **Querying** | Rich query language with filtering, sorting, indexing | SQL is powerful but heavier for this use case |

> **Verdict:** Notifications are write-heavy, schema-flexible, and JSON-based. MongoDB is the natural fit.

---

## 2. Database Schema

### Collection: `notifications`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | ObjectId | Auto | Auto-generated | MongoDB primary key |
| `title` | String | Yes | — | Notification title (max 100 chars) |
| `message` | String | Yes | — | Notification body (max 500 chars) |
| `type` | String | No | `"info"` | One of: `info`, `success`, `warning`, `error` |
| `isRead` | Boolean | No | `false` | Read/unread status |
| `createdAt` | Date | Auto | `Date.now()` | Timestamp of creation |
| `updatedAt` | Date | Auto | `Date.now()` | Timestamp of last update |

### Mongoose Schema Definition

```javascript
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
```

---

## 3. Indexes

Indexes speed up queries that filter or sort data. Without them, MongoDB scans every document (slow).

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Primary Key** | `_id` | Default | Unique lookup by ID |
| **Read Status** | `isRead` | Single | Fast filter: "show unread only" |
| **Type Filter** | `type` | Single | Fast filter: "show warnings only" |
| **Compound** | `{ isRead: 1, createdAt: -1 }` | Compound | Unread notifications sorted by newest first |
| **TTL** | `createdAt` | TTL (30 days) | Auto-delete notifications older than 30 days |

### Index Creation

```javascript
// Single field indexes
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });

// Compound index — unread notifications sorted by newest
notificationSchema.index({ isRead: 1, createdAt: -1 });

// TTL index — auto-delete after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

---

## 4. MongoDB Queries Mapped to Stage 1 APIs

### 4.1 GET `/api/notifications` — Get All

```javascript
// Basic: Get all notifications (newest first)
const notifications = await Notification.find().sort({ createdAt: -1 });

// With filters
const { type, isRead } = req.query;
const filter = {};
if (type) filter.type = type;
if (isRead !== undefined) filter.isRead = isRead === "true";

const notifications = await Notification.find(filter).sort({ createdAt: -1 });
```

### 4.2 GET `/api/notifications/:id` — Get One

```javascript
const notification = await Notification.findById(req.params.id);
if (!notification) {
  return res.status(404).json({ success: false, error: "Notification not found" });
}
```

### 4.3 POST `/api/notifications` — Create

```javascript
const notification = await Notification.create({
  title: req.body.title,
  message: req.body.message,
  type: req.body.type || "info",
});
// Returns 201 with the created document
```

### 4.4 PATCH `/api/notifications/:id/read` — Mark as Read

```javascript
const notification = await Notification.findByIdAndUpdate(
  req.params.id,
  { isRead: true },
  { new: true } // Return the updated document
);
```

### 4.5 PATCH `/api/notifications/read-all` — Mark All as Read

```javascript
const result = await Notification.updateMany(
  { isRead: false },
  { isRead: true }
);
// result.modifiedCount = number of docs updated
```

### 4.6 DELETE `/api/notifications/:id` — Delete

```javascript
const notification = await Notification.findByIdAndDelete(req.params.id);
if (!notification) {
  return res.status(404).json({ success: false, error: "Notification not found" });
}
```

---

## 5. Scaling Problems & Solutions

### Problem 1: High Volume of Notifications

As user count grows, the `notifications` collection can reach millions/billions of documents.

| Problem | Impact |
|---------|--------|
| Slow queries | Full collection scans without indexes |
| Storage bloat | Old notifications waste disk space |
| Memory pressure | MongoDB loads indexes into RAM |

**Solutions:**

| Solution | How It Helps |
|----------|-------------|
| **TTL Indexes** | Auto-delete notifications after 30 days — keeps collection size manageable |
| **Compound Indexes** | Queries like "unread, newest first" use index instead of scanning |
| **Pagination** | Return 20 results per page instead of all at once |

**Pagination Implementation:**

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;

const notifications = await Notification.find(filter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

const total = await Notification.countDocuments(filter);
```

---

### Problem 2: Read/Write Contention

Many users creating and reading notifications simultaneously.

**Solutions:**

| Solution | How It Helps |
|----------|-------------|
| **Read Replicas** | Distribute read queries across secondary nodes |
| **Write Concern** | Use `w: 1` for notifications (eventual consistency is acceptable) |
| **Bulk Operations** | Batch mark-all-as-read instead of individual updates |

---

### Problem 3: Real-Time SSE Scaling

Each connected SSE client holds an open HTTP connection on the server.

| Connections | RAM Usage (approx) |
|-------------|-------------------|
| 1,000 | ~50 MB |
| 10,000 | ~500 MB |
| 100,000 | ~5 GB |

**Solutions:**

| Solution | How It Helps |
|----------|-------------|
| **Redis Pub/Sub** | Decouple notification publishing from SSE delivery — multiple server instances can share events |
| **Connection Pooling** | Limit max SSE connections per server instance |
| **Load Balancer** | Distribute SSE connections across multiple backend servers |

**Architecture at Scale:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Client 1│    │ Client 2│    │ Client 3│
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     ▼              ▼              ▼
┌─────────────────────────────────────────┐
│           Load Balancer (Nginx)         │
└──────┬──────────────┬──────────────┬────┘
       ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│ Server 1  │  │ Server 2  │  │ Server 3  │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │               │              │
      └───────┬───────┘──────────────┘
              ▼
     ┌────────────────┐
     │   Redis Pub/Sub │
     └───────┬────────┘
             ▼
     ┌────────────────┐
     │    MongoDB      │
     │  (Replica Set)  │
     └────────────────┘
```

---

## 6. Stage 2 Summary

| Aspect | Decision |
|--------|----------|
| **Database** | MongoDB (NoSQL) |
| **ODM** | Mongoose |
| **Primary Key** | `_id` (ObjectId, auto-generated) |
| **Key Indexes** | `isRead`, `type`, `{ isRead, createdAt }`, TTL on `createdAt` |
| **Auto-Cleanup** | TTL index deletes notifications after 30 days |
| **Pagination** | `skip` + `limit` with default 20 per page |
| **Scaling** | Read replicas, Redis Pub/Sub for SSE, load balancing |

---
---

# Stage 3 — SQL Query Optimization

## 1. The Slow Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

This query fetches all **unread notifications for a specific student**, sorted by oldest first.

At first glance it looks simple. But when the `notifications` table has **millions of rows**, this query becomes extremely slow. Let's understand why.

---

## 2. Why This Query Is Slow at Scale

### The Full Table Scan Problem

When there are **no indexes** on the table, the database performs a **full table scan** — it reads **every single row** in the table to find matches.

```
Table: notifications (10,000,000 rows)

Step 1: Read row 1        → Does studentID = 1042? No.  Skip.
Step 2: Read row 2        → Does studentID = 1042? No.  Skip.
Step 3: Read row 3        → Does studentID = 1042? Yes. Is isRead = false? Yes. Keep.
...
Step 10,000,000: Read last row → Check conditions.

Then: Sort ALL matching rows by createdAt ASC.
```

| Problem | What Happens |
|---------|-------------|
| **Full Table Scan** | Database checks all 10M rows even if only 5 match |
| **No Index** | Without an index, there's no shortcut to find `studentID = 1042` |
| **Disk I/O** | Every row is loaded from disk into memory — very slow |
| **Sorting** | After finding matches, database must sort them (extra work) |
| **Time Complexity** | `O(n)` scan + `O(m log m)` sort, where `n` = total rows, `m` = matched rows |

### Real-World Impact

| Table Size | Without Index | With Proper Index |
|-----------|--------------|-------------------|
| 1,000 rows | ~1 ms | ~0.1 ms |
| 100,000 rows | ~50 ms | ~1 ms |
| 1,000,000 rows | ~500 ms | ~2 ms |
| 10,000,000 rows | ~5,000 ms (5 sec) | ~5 ms |

> At 10 million rows, the query is **1000x slower** without an index.

---

## 3. EXPLAIN — Diagnosing the Problem

The `EXPLAIN` command shows how the database executes a query.

### Before Optimization (No Index)

```sql
EXPLAIN SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

```
+----+------+------+---------+------+----------+---------+
| id | type | key  | key_len | rows | filtered | Extra   |
+----+------+------+---------+------+----------+---------+
|  1 | ALL  | NULL | NULL    | 10M  |    0.01  | Using   |
|    |      |      |         |      |          | filesort|
+----+------+------+---------+------+----------+---------+
```

| Field | Value | Meaning |
|-------|-------|---------|
| `type: ALL` | Full table scan | Reading every row — worst case |
| `key: NULL` | No index used | Database has no shortcut |
| `rows: 10M` | Scans 10 million rows | Even though only a few match |
| `Extra: Using filesort` | Sorts on disk | Extra slow sorting step |

---

## 4. Indexing Strategy

### What Is an Index?

An index is like a **book's table of contents**. Instead of reading every page to find a topic, you look up the page number directly.

```
Without index:  Read 10,000,000 rows  → Find 5 matches
With index:     Jump directly to 5 matching rows
```

### Which Index to Create?

We need an index that covers **all three operations** in the query:

1. **WHERE `studentID = 1042`** → Filter by student
2. **AND `isRead = false`** → Filter by read status
3. **ORDER BY `createdAt ASC`** → Sort by time

The best approach is a **composite (compound) index** that includes all three columns in the right order.

### The Optimal Index

```sql
CREATE INDEX idx_student_read_created
ON notifications (studentID, isRead, createdAt);
```

### Why This Column Order?

The order of columns in a composite index matters. Follow the **ESR Rule**:

| Position | Type | Column | Why |
|----------|------|--------|-----|
| 1st | **E**quality | `studentID` | Exact match (`= 1042`) narrows results the most |
| 2nd | **S**ort / Equality | `isRead` | Exact match (`= false`) further narrows |
| 3rd | **R**ange / Sort | `createdAt` | Used for `ORDER BY` — index is already sorted |

> **Key insight:** Because both `studentID` and `isRead` use equality (`=`), and `createdAt` is the sort column, the database can read matching rows **directly from the index in sorted order** — no extra sort step needed.

---

## 5. Optimized Query

```sql
-- Step 1: Create the composite index (run once)
CREATE INDEX idx_student_read_created
ON notifications (studentID, isRead, createdAt);

-- Step 2: The same query — now it's fast
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

### Additional Optimization: Select Only Needed Columns

```sql
-- Avoid SELECT * — fetch only what you need
SELECT id, title, message, type, createdAt
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

| Optimization | Reason |
|-------------|--------|
| Avoid `SELECT *` | Fetches unnecessary columns, wastes memory and bandwidth |
| Named columns | Database can use a **covering index** if all columns are in the index |

### Covering Index (Bonus Optimization)

```sql
-- Covering index: includes all columns the query needs
CREATE INDEX idx_student_read_created_covering
ON notifications (studentID, isRead, createdAt)
INCLUDE (id, title, message, type);
```

> A **covering index** means the database can answer the entire query from the index alone, without ever reading the actual table rows. This is the fastest possible execution.

---

## 6. EXPLAIN — After Optimization

```sql
EXPLAIN SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

```
+----+------+-----------------------------+---------+------+----------+-------------+
| id | type | key                         | key_len | rows | filtered | Extra       |
+----+------+-----------------------------+---------+------+----------+-------------+
|  1 | ref  | idx_student_read_created    | 9       |   5  |   100.00 | Using index |
+----+------+-----------------------------+---------+------+----------+-------------+
```

| Field | Before | After | Improvement |
|-------|--------|-------|-------------|
| `type` | `ALL` (full scan) | `ref` (index lookup) | Direct jump to matching rows |
| `key` | `NULL` | `idx_student_read_created` | Index is being used |
| `rows` | `10,000,000` | `5` | **2,000,000x fewer rows scanned** |
| `Extra` | `Using filesort` | `Using index` | No extra sorting needed |

---

## 7. Time Complexity Comparison

| Operation | Without Index | With Composite Index |
|-----------|--------------|---------------------|
| **Finding rows** | `O(n)` — scan all rows | `O(log n)` — B-tree lookup |
| **Filtering** | `O(n)` — check every row | `O(1)` — index handles it |
| **Sorting** | `O(m log m)` — sort matches | `O(0)` — already sorted in index |
| **Total** | `O(n + m log m)` | `O(log n + k)` |

Where:
- `n` = total rows in table (e.g., 10,000,000)
- `m` = rows matching the WHERE clause
- `k` = final result count (e.g., 5)

### In Plain English

| Without Index | With Index |
|--------------|-----------|
| Read 10 million rows | Jump straight to 5 rows |
| Check each row manually | Index filters automatically |
| Sort results after finding them | Results are pre-sorted |
| ~5 seconds | ~5 milliseconds |

---

## 8. Summary of All Indexes for This Table

```sql
-- Primary key (auto-created)
-- ALTER TABLE notifications ADD PRIMARY KEY (id);

-- Composite index for the slow query
CREATE INDEX idx_student_read_created
ON notifications (studentID, isRead, createdAt);

-- Index for fetching all notifications for a student
CREATE INDEX idx_student_created
ON notifications (studentID, createdAt DESC);

-- Index for counting unread notifications (badge count)
CREATE INDEX idx_student_unread
ON notifications (studentID, isRead)
WHERE isRead = false;  -- Partial index (PostgreSQL)
```

---

## 9. Stage 3 Summary

| Aspect | Detail |
|--------|--------|
| **Problem** | `SELECT *` with no indexes causes full table scan |
| **Root Cause** | No index → `O(n)` scan + `O(m log m)` filesort |
| **Solution** | Composite index on `(studentID, isRead, createdAt)` |
| **Column Order** | ESR Rule: Equality → Sort/Equality → Range/Sort |
| **Result** | `O(log n + k)` — scans only matching rows, pre-sorted |
| **Speed Gain** | ~1000x faster at 10M rows (5 sec → 5 ms) |
| **Bonus** | Covering index eliminates table lookups entirely |

---
---

# Stage 4 — Performance Optimization at Scale

## 1. Overview

When a notification system serves thousands of users with millions of notifications, **raw database queries are not enough**. We need multiple optimization layers working together to keep response times under 100ms.

```
User Request
     │
     ▼
┌──────────┐    Cache Hit?    ┌────────────┐
│  API     │ ───── Yes ─────► │   Redis    │ → Return instantly (~1ms)
│  Server  │                  │   Cache    │
│          │ ───── No ──────► └────────────┘
│          │                        │
│          │      ┌─────────────────┘
│          │      ▼
│          │  ┌────────────┐
│          │  │  MongoDB   │ → Query with indexes (~5ms)
│          │  │ (Indexed)  │
│          │  └────────────┘
│          │      │
│          │      ▼ Cache the result
│          │  Store in Redis for next request
└──────────┘
```

---

## 2. Caching with Redis

### What Is Caching?

Caching stores **frequently accessed data in memory** so the database doesn't get hit repeatedly for the same query.

### How It Works for Notifications

```javascript
const redis = require("redis");
const client = redis.createClient();

// GET /api/notifications — with caching
async function getNotifications(req, res) {
  const cacheKey = `notifications:all`;

  // Step 1: Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json({ success: true, data: JSON.parse(cached), source: "cache" });
  }

  // Step 2: Cache miss — query database
  const notifications = await Notification.find().sort({ createdAt: -1 });

  // Step 3: Store in cache (expire after 30 seconds)
  await client.setEx(cacheKey, 30, JSON.stringify(notifications));

  res.json({ success: true, data: notifications, source: "database" });
}
```

### Cache Invalidation

When data changes (create, update, delete), the cache must be cleared:

```javascript
// After creating/updating/deleting a notification:
await client.del("notifications:all");
```

### Tradeoffs

| Advantage | Disadvantage |
|-----------|-------------|
| Reduces DB queries by 90%+ | Stale data for up to TTL duration (30s) |
| Response time: ~1ms (vs ~50ms) | Extra infrastructure (Redis server) |
| Reduces DB load significantly | Cache invalidation adds complexity |
| Scales horizontally easily | Memory cost for storing cached data |

---

## 3. Pagination

### What Is Pagination?

Instead of returning **all** notifications at once, return them in small **pages** (e.g., 20 per page).

### Why It Matters

| Without Pagination | With Pagination |
|-------------------|----------------|
| Returns 10,000 notifications | Returns 20 notifications |
| Response size: ~5 MB | Response size: ~10 KB |
| Response time: ~2 seconds | Response time: ~20 ms |
| Browser freezes rendering | Smooth, instant rendering |

### Implementation

```javascript
// GET /api/notifications?page=1&limit=20
async function getNotifications(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(),
  ]);

  res.json({
    success: true,
    data: notifications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  });
}
```

### Tradeoffs

| Advantage | Disadvantage |
|-----------|-------------|
| Much smaller response payload | Multiple requests needed for all data |
| Faster response times | `skip()` becomes slow on large offsets |
| Less memory usage on client | Extra logic for page navigation |

### Solving the Skip Problem — Cursor-Based Pagination

For large datasets, `skip(10000)` is slow because MongoDB still scans 10,000 documents. Use **cursor-based pagination** instead:

```javascript
// First page
const notifications = await Notification.find()
  .sort({ createdAt: -1 })
  .limit(20);

// Next pages — use the last item's createdAt as cursor
const nextPage = await Notification.find({
  createdAt: { $lt: lastNotification.createdAt },
})
  .sort({ createdAt: -1 })
  .limit(20);
```

---

## 4. Lazy Loading (Frontend)

### What Is Lazy Loading?

Load notifications **only when the user scrolls down** or clicks "Load More", instead of loading everything upfront.

### How It Works

```
Page Load:        Fetch first 20 notifications (Page 1)
User scrolls:     Fetch next 20 notifications (Page 2)
User scrolls:     Fetch next 20 notifications (Page 3)
...
```

### React Implementation (Infinite Scroll)

```javascript
function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await api.get(`/notifications?page=${page}&limit=20`);
    const { data, pagination } = res.data;

    setNotifications((prev) => [...prev, ...data]);
    setHasMore(pagination.hasNextPage);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  // Load first page on mount
  useEffect(() => { loadMore(); }, []);

  // Detect scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMore]);

  return (
    <div>
      {notifications.map((n) => (
        <NotificationCard key={n._id} notification={n} />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
}
```

### Tradeoffs

| Advantage | Disadvantage |
|-----------|-------------|
| Fast initial page load | Slightly complex scroll logic |
| Low bandwidth usage | Users can't "jump" to page 50 |
| Smooth user experience | Need loading indicators |

---

## 5. Database Optimization

### 5.1 Projection — Fetch Only Needed Fields

```javascript
// BAD: Fetches all fields (including large message bodies)
const notifications = await Notification.find();

// GOOD: Fetch only what the UI needs
const notifications = await Notification.find()
  .select("title type isRead createdAt")  // Skip 'message' for list view
  .lean();  // Returns plain JS objects (faster than Mongoose documents)
```

| Optimization | Impact |
|-------------|--------|
| `.select()` | Reduces data transferred from DB by 40-60% |
| `.lean()` | Skips Mongoose document overhead — 3-5x faster |

### 5.2 Connection Pooling

Reuse database connections instead of creating new ones per request:

```javascript
// Mongoose handles connection pooling by default
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,      // Max 10 simultaneous connections
  minPoolSize: 2,       // Keep 2 connections always open
  socketTimeoutMS: 30000,
});
```

### 5.3 TTL — Auto-Delete Old Notifications

```javascript
// Automatically delete notifications older than 30 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
);
```

| Benefit | Detail |
|---------|--------|
| Collection stays small | Old data removed automatically |
| No cron jobs needed | MongoDB handles it natively |
| Index stays fast | Smaller index = faster lookups |

---

## 6. Reducing API Response Time

### 6.1 Response Compression (gzip)

```javascript
const compression = require("compression");

app.use(compression()); // Compress all responses
```

| Without Compression | With Compression |
|-------------------|-----------------|
| Response: 50 KB | Response: 8 KB |
| Transfer time: 40ms | Transfer time: 5ms |

### 6.2 HTTP Caching Headers

```javascript
app.get("/api/notifications", (req, res) => {
  res.set({
    "Cache-Control": "private, max-age=30", // Browser caches for 30s
    "ETag": generateETag(data),              // Conditional requests
  });
  res.json({ success: true, data });
});
```

### 6.3 Rate Limiting

Prevent a single client from overwhelming the server:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100,                 // Max 100 requests per minute
  message: { success: false, error: "Too many requests" },
});

app.use("/api/", limiter);
```

---

## 7. Reducing Database Load — Summary

| Technique | DB Queries Saved | How |
|-----------|-----------------|-----|
| **Redis Cache** | ~90% | Serve repeated reads from memory |
| **Pagination** | ~95% | Fetch 20 rows instead of 10,000 |
| **Projection** | — | Smaller documents = less I/O |
| **Lean queries** | — | Skip Mongoose overhead |
| **Connection pooling** | — | Reuse connections instead of opening new ones |
| **TTL indexes** | — | Keep collection size small automatically |
| **Compression** | — | Smaller payloads = faster transfer |

---

## 8. Optimization Tradeoffs at a Glance

| Technique | Speed Gain | Complexity | Cost | Best For |
|-----------|-----------|-----------|------|----------|
| **Redis Caching** | ★★★★★ | Medium | Redis server | Read-heavy APIs |
| **Pagination** | ★★★★☆ | Low | None | Large data lists |
| **Lazy Loading** | ★★★★☆ | Medium | None | Frontend UX |
| **DB Indexes** | ★★★★★ | Low | Storage | All queries |
| **Projection** | ★★★☆☆ | Low | None | Large documents |
| **Compression** | ★★★☆☆ | Low | CPU | All API responses |
| **Rate Limiting** | ★★☆☆☆ | Low | None | API protection |
| **TTL Indexes** | ★★★☆☆ | Low | None | Time-series data |

---

## 9. Stage 4 Summary

| Aspect | Recommendation |
|--------|---------------|
| **Caching** | Redis with 30s TTL, invalidate on writes |
| **Pagination** | Cursor-based for large datasets, offset for small |
| **Lazy Loading** | Infinite scroll on frontend, fetch 20 at a time |
| **DB Optimization** | Projection + lean queries + connection pooling |
| **Response Time** | gzip compression + HTTP cache headers |
| **DB Load** | Redis eliminates ~90% of read queries |
| **Protection** | Rate limiting at 100 req/min per client |

---
---

# Stage 5 — Queue-Based Notification Architecture

## 1. The Problem: Synchronous Notification Sending

In our current design (Stages 1–4), when a notification is created via `POST /api/notifications`, the server does everything **synchronously** — save to DB, broadcast via SSE, and respond to the client — all in a single request.

### How Synchronous Sending Works

```
Client sends POST /api/notifications
     │
     ▼
┌────────────────────────────┐
│  API Server (single thread)│
│                            │
│  1. Validate input         │  ← 1 ms
│  2. Save to MongoDB        │  ← 20 ms
│  3. Send email             │  ← 500 ms (external API)
│  4. Send push notification │  ← 300 ms (external API)
│  5. Broadcast SSE          │  ← 5 ms
│  6. Respond to client      │
│                            │
│  Total: ~826 ms            │
└────────────────────────────┘
```

### Problems with This Approach

| Problem | Description |
|---------|-------------|
| **Slow response** | Client waits 826ms for a single notification — unacceptable at scale |
| **Blocking** | If email service is down, the entire request fails |
| **No retry** | If push notification fails, it's lost forever |
| **Coupled** | API server handles business logic AND delivery — too many responsibilities |
| **No scalability** | 1,000 simultaneous notifications = 1,000 blocked threads |
| **Single point of failure** | Server crash = all in-flight notifications are lost |

---

## 2. The Solution: Queue-Based Architecture

Separate **accepting** notifications from **delivering** them using a **message queue**.

### Architecture Overview

```
┌──────────┐     POST      ┌──────────────┐     Publish     ┌──────────────┐
│  Client  │ ─────────────►│  API Server  │ ───────────────►│ Message Queue│
│          │               │              │                  │  (RabbitMQ)  │
│          │◄──────────────│  1. Validate  │                  │              │
│          │  201 Created  │  2. Save to DB│                  │              │
│          │  (instant)    │  3. Publish   │                  └──────┬───────┘
└──────────┘               └──────────────┘                         │
                                                          ┌────────┼────────┐
                                                          │        │        │
                                                          ▼        ▼        ▼
                                                    ┌─────────┐┌─────────┐┌─────────┐
                                                    │Worker 1 ││Worker 2 ││Worker 3 │
                                                    │(Email)  ││(Push)   ││(SSE)    │
                                                    └────┬────┘└────┬────┘└────┬────┘
                                                         │         │         │
                                                    ┌────▼────┐    │    ┌────▼────┐
                                                    │ Email   │    │    │   SSE   │
                                                    │ Service │    │    │ Clients │
                                                    └─────────┘    │    └─────────┘
                                                              ┌────▼────┐
                                                              │  Push   │
                                                              │ Service │
                                                              └─────────┘
```

### What Changed?

| Before (Synchronous) | After (Queue-Based) |
|----------------------|-------------------|
| API does everything | API only saves + publishes to queue |
| Client waits 826ms | Client waits ~25ms |
| Failure = data loss | Failure = message stays in queue for retry |
| 1 server does all work | Multiple workers process in parallel |

---

## 3. Key Components Explained

### 3.1 Message Queue (RabbitMQ / BullMQ)

A message queue is like a **to-do list** between services. The API server **adds tasks**, and worker services **pick them up** one by one.

```
API Server says:     "Send email to user@example.com"
                          │
                          ▼
Queue stores:        [Task 1] [Task 2] [Task 3] [Task 4]
                                        │
                                        ▼
Worker picks up:     "Processing Task 3 — sending email..."
```

**Why use a queue?**

| Benefit | Explanation |
|---------|------------|
| **Decoupling** | API doesn't need to know how emails are sent |
| **Buffering** | If 10,000 notifications arrive at once, the queue holds them |
| **Reliability** | Messages persist even if workers crash |
| **Ordering** | Messages are processed in order (FIFO) |

### 3.2 Worker Services

Workers are **background processes** that consume messages from the queue and perform the actual work.

```javascript
// worker/emailWorker.js
const Queue = require("bull");

const emailQueue = new Queue("email-notifications", {
  redis: { host: "localhost", port: 6379 },
});

// Process jobs from the queue
emailQueue.process(async (job) => {
  const { to, subject, body } = job.data;

  // Send the email
  await sendEmail(to, subject, body);

  console.log(`Email sent to ${to}`);
});
```

| Property | Detail |
|----------|--------|
| **Independent** | Workers run as separate Node.js processes |
| **Scalable** | Start 5 workers to process 5x faster |
| **Isolated** | One worker crashing doesn't affect others |

### 3.3 Retry Mechanism

When a delivery attempt fails (e.g., email service timeout), the queue **automatically retries** with increasing delays.

```javascript
// Configure retry strategy
const emailQueue = new Queue("email-notifications", {
  redis: { host: "localhost", port: 6379 },
  defaultJobOptions: {
    attempts: 5,          // Retry up to 5 times
    backoff: {
      type: "exponential",
      delay: 1000,        // 1s, 2s, 4s, 8s, 16s
    },
    removeOnComplete: true,
    removeOnFail: false,  // Keep failed jobs for inspection
  },
});
```

**Exponential Backoff:**

```
Attempt 1: Immediate    → Failed (email service down)
Attempt 2: Wait 1s      → Failed
Attempt 3: Wait 2s      → Failed
Attempt 4: Wait 4s      → Failed
Attempt 5: Wait 8s      → Success! Email sent.
```

| Benefit | Detail |
|---------|--------|
| Handles transient failures | Network timeouts, service restarts |
| Doesn't overwhelm services | Increasing delay gives services time to recover |
| Configurable | Set max attempts and delay strategy per queue |

### 3.4 Dead Letter Queue (DLQ)

If all retry attempts fail, the message moves to a **Dead Letter Queue** — a special queue for messages that couldn't be processed.

```
Main Queue ──► Worker tries 5 times ──► All failed ──► Dead Letter Queue
                                                            │
                                                            ▼
                                                     Admin dashboard
                                                     alerts the team
```

```javascript
// Handle permanently failed jobs
emailQueue.on("failed", (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    // Move to Dead Letter Queue
    deadLetterQueue.add({
      originalJob: job.data,
      error: err.message,
      failedAt: new Date(),
      attempts: job.attemptsMade,
    });

    // Alert the team
    console.error(`ALERT: Notification permanently failed after ${job.attemptsMade} attempts`);
  }
});
```

| Purpose | Detail |
|---------|--------|
| **No data loss** | Failed messages are preserved, not discarded |
| **Debugging** | Engineers can inspect why messages failed |
| **Manual retry** | Messages can be moved back to the main queue |
| **Monitoring** | Alert when DLQ grows — signals a systemic issue |

### 3.5 Fault Tolerance

The system continues working even when individual components fail.

| Component Failure | What Happens | Recovery |
|------------------|-------------|----------|
| **API Server crashes** | Queue still holds unprocessed messages | Restart API, messages are safe |
| **Worker crashes** | Unacknowledged message returns to queue | Another worker picks it up |
| **Email service down** | Retry mechanism kicks in (5 attempts) | Email sent when service recovers |
| **Redis crashes** | BullMQ persists jobs to disk | Jobs restored on Redis restart |
| **MongoDB down** | API returns 500, queue pauses | Resume when DB is back |

---

## 4. Step-by-Step Flow

### Creating and Delivering a Notification

```
Step 1: Client sends POST /api/notifications
        Body: { title: "New Assignment", message: "Math homework due", type: "info" }

Step 2: API Server receives the request
        → Validates input (title and message required)
        → Saves notification to MongoDB
        → Publishes message to the notification queue
        → Responds with 201 Created (client is done waiting)

Step 3: Message sits in the queue
        Queue: [ { id: "abc123", channels: ["email", "push", "sse"] } ]

Step 4: Email Worker picks up the message
        → Reads notification from MongoDB
        → Sends email via SendGrid/Nodemailer
        → Acknowledges the message (removes from queue)

Step 5: Push Worker picks up the message
        → Sends push notification via Firebase
        → Acknowledges the message

Step 6: SSE Worker picks up the message
        → Broadcasts to all connected SSE clients
        → Acknowledges the message

Step 7: If any worker fails
        → Message stays in queue
        → Retried with exponential backoff
        → After 5 failures → Dead Letter Queue
```

---

## 5. Pseudocode

### API Server — Publishing to Queue

```javascript
// POST /api/notifications
async function createNotification(req, res) {
  try {
    // 1. Validate
    const { title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: "Title and message required" });
    }

    // 2. Save to database
    const notification = await Notification.create({ title, message, type });

    // 3. Publish to queue (non-blocking)
    await notificationQueue.add("deliver", {
      notificationId: notification._id,
      channels: ["email", "push", "sse"],
    });

    // 4. Respond immediately
    res.status(201).json({ success: true, data: notification });

  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
}
```

### Worker — Processing Queue Messages

```javascript
// workers/notificationWorker.js
const Queue = require("bull");

const notificationQueue = new Queue("notifications", {
  redis: { host: "localhost", port: 6379 },
});

notificationQueue.process("deliver", async (job) => {
  const { notificationId, channels } = job.data;

  // Fetch notification from DB
  const notification = await Notification.findById(notificationId);
  if (!notification) throw new Error("Notification not found");

  // Deliver to each channel
  const results = await Promise.allSettled(
    channels.map((channel) => deliverToChannel(channel, notification))
  );

  // Check for failures
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    throw new Error(`Failed channels: ${failures.map((f) => f.reason).join(", ")}`);
  }

  return { delivered: channels, timestamp: new Date() };
});

// Channel delivery logic
async function deliverToChannel(channel, notification) {
  switch (channel) {
    case "email":
      return await sendEmail(notification);
    case "push":
      return await sendPushNotification(notification);
    case "sse":
      return await broadcastSSE(notification);
    default:
      throw new Error(`Unknown channel: ${channel}`);
  }
}
```

---

## 6. How This Improves Scalability & Reliability

### Scalability

| Aspect | Synchronous | Queue-Based |
|--------|------------|-------------|
| **Throughput** | ~100 notifications/sec | ~10,000+ notifications/sec |
| **Scaling** | Scale entire API server | Scale workers independently |
| **Burst handling** | Server overloads | Queue absorbs the burst |
| **Adding channels** | Modify API code | Add a new worker (zero API changes) |

### Reliability

| Aspect | Synchronous | Queue-Based |
|--------|------------|-------------|
| **Failure handling** | Request fails, data lost | Message retried automatically |
| **Partial failure** | If email fails, everything fails | Email retries, push still succeeds |
| **Recovery** | Manual re-send needed | Automatic via retry + DLQ |
| **Monitoring** | Check server logs | Queue dashboard shows pending/failed jobs |

---

## 7. Technology Choices

| Component | Recommended | Alternative |
|-----------|------------|-------------|
| **Message Queue** | BullMQ (Node.js + Redis) | RabbitMQ, Apache Kafka |
| **Workers** | Separate Node.js processes | PM2 cluster mode |
| **Email** | Nodemailer + SendGrid | AWS SES, Mailgun |
| **Push** | Firebase Cloud Messaging | OneSignal |
| **Monitoring** | Bull Board (web dashboard) | Grafana + Prometheus |

### Why BullMQ for This Project?

| Reason | Detail |
|--------|--------|
| Same language | Node.js — no need to learn a new language |
| Redis-backed | Already using Redis for caching (Stage 4) |
| Simple API | `queue.add()` and `queue.process()` — beginner friendly |
| Built-in features | Retry, backoff, DLQ, rate limiting, priorities |

---

## 8. Stage 5 Summary

| Aspect | Detail |
|--------|--------|
| **Problem** | Synchronous sending is slow, fragile, and doesn't scale |
| **Solution** | Queue-based architecture decouples API from delivery |
| **Queue** | BullMQ (Redis-backed, Node.js native) |
| **Workers** | Independent processes for email, push, SSE |
| **Retry** | Exponential backoff, up to 5 attempts |
| **DLQ** | Failed messages preserved for debugging and manual retry |
| **Fault Tolerance** | Any component can fail without losing messages |
| **API Response** | 826ms → ~25ms (save + publish only) |
| **Throughput** | 100/sec → 10,000+/sec with multiple workers |

---
---

# Stage 6 — Backend Priority System Implementation

## 1. Overview

In this stage, we implemented a robust **Node.js/Express.js backend** to fetch, prioritize, sort, and serve notifications.

### Core Requirements Solved:
1.  **External API Integration:** Fetch data from `http://4.224.186.213/evaluation-service/notifications` (with a local fallback if the API is down).
2.  **Priority Logic:** 
    - `placement` = Priority 1 (Highest)
    - `result` = Priority 2 (Medium)
    - `event` = Priority 3 (Lower)
3.  **Sorting Logic:** Sort primarily by Priority, and secondarily by Recency (Newest first).
4.  **Pagination/Limits:** Return the top 10 most relevant notifications.

---

## 2. Clean Architecture & Folder Structure

We used a **modular, layered architecture** to separate concerns. This makes the code easier to test, maintain, and scale.

```text
notification_app_be/
│
├── controllers/
│   └── notificationController.js   # Handles HTTP requests & responses
│
├── middleware/
│   ├── errorHandler.js             # Global error catcher
│   └── loggingMiddleware.js        # Request logging with response times
│
├── routes/
│   └── notificationRoutes.js       # Maps URLs to controllers
│
├── services/
│   └── notificationService.js      # Core business logic (fetch, sort, prioritize)
│
├── utils/
│   ├── priorityConstants.js        # Priority mapping definitions
│   └── responseHelper.js           # Standardized JSON response formats
│
├── .env                            # Environment variables (PORT, ACCESS_CODE)
├── package.json                    # Dependencies (express, axios, cors)
└── server.js                       # App entry point
```

### Why this structure?
- **Controllers** shouldn't know *how* data is fetched, they just handle the `req` and `res`.
- **Services** handle the heavy lifting (business logic) so they can be reused without HTTP context.
- **Utils** keep reusable helper functions DRY (Don't Repeat Yourself).

---

## 3. Code Implementation & Explanation

### 3.1. Priority Constants (`utils/priorityConstants.js`)
We use a dictionary/map for O(1) lookup times when assigning priorities.

```javascript
const PRIORITY_MAP = {
  placement: 1, // Highest priority
  result: 2,    // Medium priority
  event: 3,     // Lower priority
};

function getPriority(type) {
  if (!type) return 99; // Default for unknown
  return PRIORITY_MAP[type.toLowerCase()] || 99;
}
```

### 3.2. Business Logic (`services/notificationService.js`)
This is the core engine. It fetches data via `axios` and applies the custom sorting algorithm.

```javascript
const axios = require("axios");

// 1. Fetching Data
async function fetchNotificationsFromAPI() {
  try {
    const response = await axios.get(API_URL, {
      headers: { "Authorization": `Bearer ${process.env.ACCESS_CODE}` }
    });
    return response.data.notifications;
  } catch (error) {
    // Falls back to mock data if the evaluation server is down
    return MOCK_NOTIFICATIONS; 
  }
}

// 2. Sorting Logic
function sortByPriorityAndRecency(notifications) {
  return [...notifications].sort((a, b) => {
    // Tiebreaker 1: Priority (1 comes before 2)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Tiebreaker 2: Recency (Newest date comes first)
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });
}
```

### 3.3. HTTP Controller (`controllers/notificationController.js`)
Connects the service to the Express response.

```javascript
async function getTopNotifications(req, res, next) {
  try {
    // Call the service layer
    const result = await notificationService.getTopNotifications();
    
    // Use standard response wrapper
    return successResponse(res, 200, result.notifications, "Success");
  } catch (error) {
    next(error); // Pass to global error handler
  }
}
```

### 3.4. Logging Middleware (`middleware/loggingMiddleware.js`)
Logs every request automatically to the terminal to track API performance.

```javascript
function loggingMiddleware(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    // e.g., [2026-05-16] GET /api/notifications 200 45ms
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
}
```

---

## 4. Sample API Response

When calling `GET /api/notifications`, the server returns a standardized JSON structure. Notice how `placement` (Priority 1) appears before `result` (Priority 2).

```json
{
  "success": true,
  "message": "Top 10 notifications fetched successfully",
  "count": 10,
  "data": [
    {
      "id": "1",
      "title": "Google On-Campus Drive",
      "message": "Google visiting campus on May 20th for SDE roles",
      "type": "placement",
      "createdAt": "2026-05-16T10:00:00.000Z",
      "priority": 1
    },
    {
      "id": "4",
      "title": "Semester Results Published",
      "message": "6th semester results available on portal",
      "type": "result",
      "createdAt": "2026-05-16T08:00:00.000Z",
      "priority": 2
    },
    {
      "id": "8",
      "title": "Hackathon 2026",
      "message": "Annual hackathon on May 30th — register now",
      "type": "event",
      "createdAt": "2026-05-16T07:00:00.000Z",
      "priority": 3
    }
  ]
}
```

---

## 5. How to Run the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd notification_app_be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. **Test the endpoints:**
   - Top 10 Notifications: `http://localhost:3002/api/notifications`
   - All Notifications: `http://localhost:3002/api/notifications/all`
   - Filter by Type: `http://localhost:3002/api/notifications/type/placement`

---
---

# Stage 7 — Frontend Application Implementation

## 1. Overview

In this stage, we implemented the frontend user interface using **React.js** and **Vite**, styled exclusively with **Material UI (MUI)**. 

### Core Features Implemented:
1. **API Integration:** Connects to our Express backend via an Axios instance with built-in logging interceptors.
2. **Dashboard Filtering:** Filter tabs for "All", "Top Priority", "Placements", "Results", and "Events".
3. **Pagination:** Displays 5 notifications per page for optimal UX and fast rendering.
4. **State Management:** Handles loading spinners, empty states, and error alerts automatically.
5. **Mark as Viewed:** Users can mark notifications as viewed, which dynamically dims the card and updates the icon.

---

## 2. Folder Structure

We used a standard, professional React directory structure:

```text
notification_app_fe/
│
├── src/
│   ├── components/
│   │   └── NotificationCard.jsx  # Reusable UI card for a single notification
│   │
│   ├── hooks/
│   │   └── useNotifications.js   # Custom hook for fetching and state management
│   │
│   ├── pages/
│   │   └── Dashboard.jsx         # Main page containing tabs and pagination
│   │
│   ├── services/
│   │   └── api.js                # Axios instance with logging middleware interceptors
│   │
│   ├── App.jsx                   # Theme provider and React Router setup
│   └── main.jsx                  # React DOM entry point
│
├── vite.config.js                # Configured to run strictly on port 3000
└── package.json                  # Dependencies (@mui/material, axios, react-router-dom)
```

---

## 3. Key Components Explained

### 3.1. Frontend Logging Middleware (`src/services/api.js`)
We use **Axios Interceptors** to log all incoming and outgoing API requests to the browser console. This acts as our frontend logging middleware.

```javascript
import axios from 'axios';

const api = axios.create({ baseURL: '/api' }); // Proxies to backend

// Request Interceptor
api.interceptors.request.use((config) => {
  console.log(`[REQ] -> ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Response Interceptor
api.interceptors.response.use((response) => {
  console.log(`[RES] <- ${response.status} ${response.config.url}`, response.data);
  return response;
});
```

### 3.2. Custom Hook for State Management (`src/hooks/useNotifications.js`)
By moving API calls into a custom hook, our UI components remain clean. The hook manages `loading`, `error`, and `notifications` state.

```javascript
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async (type = 'all') => {
    setLoading(true);
    let endpoint = type === 'top' ? '/notifications' : 
                   type === 'all' ? '/notifications/all' : `/notifications/type/${type}`;
                   
    const res = await api.get(endpoint);
    // Add local 'isViewed' tracking for the UI demo
    setNotifications(res.data.data.map(n => ({ ...n, isViewed: false })));
    setLoading(false);
  }, []);

  return { notifications, loading, fetchNotifications };
};
```

### 3.3. Main Dashboard & Pagination (`src/pages/Dashboard.jsx`)
The dashboard automatically fetches data when the user switches tabs.

```javascript
// Pagination Logic
const itemsPerPage = 5;
const startIndex = (page - 1) * itemsPerPage;
const paginatedNotifications = notifications.slice(startIndex, startIndex + itemsPerPage);

// ... Render UI ...
<Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
  <Tab label="All" value="all" />
  <Tab label="Top Priority" value="top" />
  <Tab label="Placements" value="placement" />
</Tabs>

{/* Render paginated list */}
{paginatedNotifications.map(notif => (
  <NotificationCard key={notif.id} notification={notif} />
))}

{/* MUI Pagination Component */}
<Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} />
```

### 3.4. Reusable Notification Card (`src/components/NotificationCard.jsx`)
This component dynamically styles itself based on the notification type and `isViewed` state using Material UI props.

```javascript
const getStyling = (type) => {
  switch (type) {
    case 'placement': return { color: 'error', icon: <BusinessCenterIcon /> }; // Red
    case 'result': return { color: 'warning', icon: <AssignmentTurnedInIcon /> }; // Orange
    case 'event': return { color: 'info', icon: <EventIcon /> }; // Blue
  }
};

// If viewed, remove the left border, dim the opacity, and drop the shadow.
return (
  <Card sx={{ 
    borderLeft: isViewed ? 'none' : '4px solid',
    borderLeftColor: `${style.color}.main`,
    opacity: isViewed ? 0.7 : 1
  }}>
     {/* Card Content... */}
  </Card>
);
```

---

## 4. How to Run the Frontend

The project is configured via `vite.config.js` to strictly run on `http://localhost:3000` to meet the evaluation requirements.

1. **Open a new terminal** and navigate to the frontend directory:
   ```bash
   cd notification_app_fe
   ```

2. **Install all required dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the application:**
   - Open your browser to: `http://localhost:3000`
   - *Note: Ensure your backend server (`notification_app_be`) is also running on port 3002, as the frontend proxies API requests there.*
