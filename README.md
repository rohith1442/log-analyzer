# Real-Time Log Analyzer & Visualizer

A full-stack real-time log monitoring dashboard built using:

* **Node.js + Express**
* **MongoDB (Mongoose)**
* **Socket.io (WebSockets)**
* **React (Create React App)**
* **Recharts (for charts)**

This project generates logs automatically and allows filtering, pagination, auto-refresh, live streaming, and dynamic stats window selection.

---

# Features

## Backend

* Generates a new log entry every second
* Stores logs in MongoDB
* REST APIs for logs and stats
* Supports filtering and pagination
* Real-time updates using WebSockets

## Frontend

* Displays logs in a table
* Filter by:

  * Log Level (INFO, WARN, ERROR)
  * Service (auth, payments, notifications)
  * Free-text search
* Pagination support
* Adjustable refresh interval (5s / 30s / 60s)
* Live mode using WebSockets
* Adjustable stats window (30s / 60s / 120s)
* Bar chart visualization using Recharts

---

# Prerequisites

Make sure you have installed:

* Node.js (v18+ recommended)
* MongoDB (Local or MongoDB Atlas)
* npm or yarn

---

#  Backend Setup

## Navigate to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

##  Create `.env` file

Inside the backend folder, create a file named:

```
.env
```

Add the following:

```
PORT=8000
DB_URL=mongodb://localhost:27017/log-analyzer
```

If using MongoDB Atlas:

```
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/log-analyzer
```

## Start Backend

```bash
node index.js
```

You should see:

```
Connected to DB
Server running on port 8000
```

Backend runs at:

```
http://localhost:8000
```

---

# Frontend Setup

## Navigate to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Create `.env` file

Inside frontend folder create:

```
.env
```

Add:

```
REACT_APP_API_URL=http://localhost:8000
```

## Start Frontend

```bash
npm start
```

App runs at:

```
http://localhost:3000
```

---

# API Endpoints

## GET /logs

Supports query parameters:

* level
* service
* search
* limit
* skip

Example:

```
GET /logs?level=ERROR&service=auth&limit=10&skip=0
```

---

##  GET /logs/stats

Supports query parameter:

* seconds

Example:

```
GET /logs/stats?seconds=60
```

---

# Refresh Modes

##  Live Mode

* Uses WebSocket connection
* Instant updates from backend
* No polling

## Polling Mode

* 5 seconds
* 30 seconds
* 60 seconds
* Uses `setInterval` to fetch data

---

# Stats Window

Users can dynamically change the stats time window:

* 30 seconds
* 60 seconds
* 120 seconds

The chart updates based on the selected window.

---

# Project Structure

```
backend/
  controllers/
  models/
  routes/
  socket.js
  index.js

frontend/
  src/
    api/
    components/
    socket.js
    App.js
```

---

# Architecture Overview

* Initial data load → REST API
* Live mode → WebSocket streaming
* Polling mode → Interval-based API calls
* MongoDB stores timestamps in UTC

---

## MongoDB not running

Start MongoDB locally:

```bash
mongod
```

---

# 👨‍💻 Author

Rohith Gullapudi

---

 This project demonstrates full-stack real-time system design, including REST APIs, WebSocket streaming, dynamic filtering, and data visualisation.
