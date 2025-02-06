<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/shindeamul76/shindeamul76-catalogus-IBDG.git">
   <img src="https://media.licdn.com/dms/image/v2/D560BAQHmybhQYxFtnQ/company-logo_200_200/company-logo_200_200/0/1723276727491/catalogusdotin_logo?e=2147483647&v=beta&t=Y52z7Eo2U_zThSwduseDE61XUXdeLFefGtLE0RqSOLg" alt="Logo">
  </a>

  <h3 align="center">URL Shortner</h3>

  <p align="center">
    Become a Certified Career Planner.
    <br />
    <a href="https://shindeamul76-catalogus-ibdg-1byct6p0y-shindeamul76s-projects.vercel.app/"><strong>Deployed URL »</strong></a>
    <br />
    <br />
    <a href="https://github.com/shindeamul76/shindeamul76-catalogus-IBDG.git">Discussions</a>
    ·
    <a href="https://www.catalogus.in/">Website</a>
    ·
    <a href="https://github.com/shindeamul76/shindeamul76-catalogus-IBDG.git/issues">Issues</a>
    ·
    <a href="https://www.catalogus.in/">Roadmap</a>
  </p>
</p>


# Image-Based Data Generation with Next.js, Redis, and MongoDB

## 📌 Overview
This project implements an **Image-Based Data Generation System** using **Next.js (Frontend & Backend API)** and a **Worker Service** to process tasks asynchronously. The application allows users to submit an image URL, stores it in **MongoDB**, queues the processing task in **Redis**, and has a worker service to validate and update the task status.

## 🚀 Features

### ✅ **Frontend (Next.js)**
- Users can submit an **Image URL** via an input field.
- Displays a list of submitted tasks with:
  - **Task ID**
  - **Image URL**
  - **Status** (**Pending, Processing, Success, Failed**)
- Implements **pagination** for task listing.
- Uses **React Query** for efficient data fetching.

### ✅ **Backend API (Next.js API Routes)**
- **`/api/submit-task`**
  - Accepts an image URL from the frontend.
  - Saves the **task ID & initial status (Pending)** in **MongoDB**.
  - Queues the task in **Redis** for processing.
  - Returns the **task ID** to the frontend.
- **`/api/get-tasks`**
  - Fetches **task details** from MongoDB.
  - Supports **pagination**.
- **`/api/health`**
  - Checks **MongoDB** and **Redis** connectivity.

### ✅ **Worker Service (Node.js)**
- Connects to **Redis** and listens for new tasks.
- **Processes two tasks concurrently**.
- Waits **1 minute per task** (simulating data generation).
- Validates the **image URL**:
  - Updates task **status to Success** if URL is reachable.
  - Updates task **status to Failed** if URL is invalid.
- Uses **BullMQ** for managing Redis queue.

### ✅ **Database (MongoDB Atlas)**
- Stores tasks with fields:
  - **taskId**: Unique identifier.
  - **imageUrl**: User-submitted image URL.
  - **status**: Pending, Processing, Success, Failed.
  - **timestamp**: Date of submission.

---

## 🔧 **Tech Stack**
- **Frontend**: Next.js, React Query, TailwindCSS.
- **Backend**: Next.js API Routes, MongoDB.
- **Worker Service**: Node.js, BullMQ, Redis.
- **Database**: MongoDB Atlas.

---

## 🛠 **Setup Instructions**

### 🔹 **Prerequisites**
- **Node.js** (v18+)
- **Redis Cloud** (or local Redis)
- **MongoDB Atlas** (or local MongoDB)

### 🔹 **1. Clone the Repository**
```bash
  git clone https://github.com/shindeamul76/shindeamul76-catalogus-IBDG.git
  cd catalogus-url
```

### 🔹 **2. Install Dependencies**
```bash
  pnpm install
```

### 🔹 **3. Configure Environment Variables**
Create a `.env.local` file for **Next.js** and a `.env` file for the **worker service**.
Copy the Respective `.env.example` file and rename it to `.env.local`  for **Next.js** 
Copy the Respective `.env.example` file and rename it to `.env` for the **worker service**.

```env For Worker Service
# MongoDB
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/dbname

# Redis
REDIS_URL=redis://default:yourpassword@redis-12345.c10.us-east-1-3.ec2.cloud.redislabs.com:6379
```

```env for Next.js
# MongoDB
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/dbname

# Redis
NEXT_PUBLIC_REDIS_URL=redis://default:yourpassword@redis-12345.c10.us-east-1-3.ec2.cloud.redislabs.com:6379
```

### 🔹 **4. Start the Development Server**
```bash
pnpm install
```

```bash
pnpm run dev
```
- The frontend will be available at `http://localhost:3000`.
- API routes will be accessible at `http://localhost:3000/api/`.

### 🔹 **5. Start the Worker Service**
```bash
cd workers
yarn install
yarn run dev:worker
```
- The worker will start processing tasks from the Redis queue.


## 📌 **API Endpoints**

### 🔹 **1. Submit a Task**
```http
POST /api/submit-task
```
#### Request Body:
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```
#### Response:
```json
{
  "taskId": "abc123",
  "status": "Pending"
}
```

### 🔹 **2. Fetch Tasks**
```http
GET /api/get-tasks?page=1&limit=10
```
#### Response:
```json
[
  {
    "taskId": "abc123",
    "imageUrl": "https://example.com/image.jpg",
    "status": "Processing",
    "timestamp": "2025-01-01T00:00:00Z"
  }
]
```

---

## 📌 **Worker Service Implementation**
### **Worker Process Flow**
1. Connects to **Redis** and **MongoDB**.
2. **Listens for new tasks** in the queue.
3. **Processes two tasks at a time** (Concurrency = 2).
4. **Waits for 1 minute per task** (Simulating processing).
5. **Validates the URL** (Checks if it is reachable).
6. Updates the **task status** in **MongoDB** to `Success` or `Failed`.

### **Worker Code (`worker.js`)**
```js
import { Queue, Worker } from "bullmq";
import mongoose from "mongoose";
import fetch from "node-fetch";
import Task from "./models/TaskModel";

const queue = new Queue("imageQueue", { connection: { host: "localhost", port: 6379 } });

const worker = new Worker("imageQueue", async (job) => {
  const { taskId, imageUrl } = job.data;
  await Task.updateOne({ taskId }, { status: "Processing" });

  await new Promise((resolve) => setTimeout(resolve, 60000));

  const response = await fetch(imageUrl);
  const status = response.ok ? "Success" : "Failed";

  await Task.updateOne({ taskId }, { status });
});
```



