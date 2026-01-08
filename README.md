# MERN Stack Admin Panel (BookMyShow Theme)

A professional, lean, and secure admin panel for managing events. Built with TypeScript and modern MERN practices.

## Features
- **Secure Admin Login**: Basic JWT-based authentication.
- **Full CRUD**: Create, Read, Update, and Delete events.
- **Search & Filter**: Search events by title in real-time.
- **Validation**: Frontend & Backend validation for all forms.
- **Responsive UI**: Blue/Orange light theme inspired by the provided palette.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Lucide React, Axios.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **Database**: MongoDB (In-memory fallback for local demo).

## Deployment Guide

### Why the 404/Not Found?
When deploying to Vercel, two common issues occur:
1. **SPA Routing**: React apps need a `vercel.json` to redirect all requests to `index.html`. (Already added to `client/vercel.json`).
2. **Hardcoded URLs**: `localhost` only works locally. High-performance production apps use Environment Variables.

### Deployment Steps

#### 1. Backend (e.g., Render / Railway)
- Deploy the `server/` folder.
- Set Env Vars:
  - `MONGODB_URI`: Your production MongoDB link.
  - `JWT_SECRET`: A long random string.
  - `BASE_URL`: Your deployed backend URL.
  - `USE_MEMORY_DB`: `false` (for production).

#### 2. Frontend (Vercel)
- Deploy the `client/` folder.
- Set Env Var:
  - `VITE_API_URL`: Your backend URL + `/api`.

## Setup Instructions (Local)
1. `cd server && npm install && npm run dev`
2. `cd client && npm install && npm run dev`
3. Login: `admin` / `admin123`
