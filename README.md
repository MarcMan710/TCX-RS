# 🏸 Badminton Court Reservation System

A full-stack, enterprise-grade booking and venue management platform built with **Next.js**, **Golang (Gin)**, and **PostgreSQL**. Designed to solve real-time court availability, double-booking prevention, and automated administrative operations.

---

## 📸 System Overview

```
                   BADMINTON RESERVATION SYSTEM
                              │
               ┌──────────────┴──────────────┐
               │                             │
            CUSTOMER                       ADMIN
               │                             │
         ┌─────┴─────┐                 ┌─────┴─────┐
         │           │                 │           │
      Browse      Booking           Venues      Reports
      Courts      History           Courts      Users
         │           │                 │           │
         └─────┬─────┘                 └─────┬─────┘
               │                             │
               └──────────────┬──────────────┘
                              │
                         Next.js (App Router)
                              │
                           REST API (JWT via HTTP-only Cookie)
                              │
                         Golang (Gin Framework)
                              │
                  ┌───────────┴───────────┐
                  │                       │
             Auth / RBAC          Reservation Engine (GORM)
                                          │
                                          ▼
                                    PostgreSQL

```

---

## ✨ Features

### 👤 Customer Experience

* **Authentication:** Secure registration, login, session persistence, and role-based route access.
* **Venue Discovery:** Browse venues, filter by location/facilities, and inspect court details.
* **Real-time Scheduling:** Select interactive date/time slots with live availability checks.
* **Booking Management:** Track upcoming reservations, view historical receipts, and cancel eligible slots based on lead-time constraints.

### 🛡️ Admin & Venue Operations

* **Operational Dashboard:** Live analytics tracking daily revenue, total bookings, court utilization rates, and active customers.
* **Venue & Court CRUD:** Create and manage venue profiles, upload images, set operating hours, and configure individual court statuses (`AVAILABLE`, `MAINTENANCE`, `INACTIVE`).
* **Schedule Control:** Define custom time slots, set peak/off-peak hourly rates, and manage maintenance overrides.

---

## 🛠️ Tech Stack

### Frontend

* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS
* **State & Data Fetching:** TanStack Query (React Query)
* **Form & Validation:** React Hook Form + Zod
* **HTTP Client:** Axios (Interceptors for token refreshing)
* **Utilities:** `date-fns`

### Backend

* **Language:** Go 1.22+
* **HTTP Framework:** Gin Gonic
* **Database & ORM:** PostgreSQL + GORM
* **Authentication:** JWT (Stored in HTTP-Only Cookies) + `golang.org/x/crypto/bcrypt`
* **Live Reloading:** Air
* **API Documentation:** Swagger / Swag

---

## 🗄️ Database Architecture

```
  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
  │    Users    │       │   Venues    │       │   Courts    │
  ├─────────────┤       ├─────────────┤       ├─────────────┤
  │ id (PK)     │       │ id (PK)     │ 1   * │ id (PK)     │
  │ name        │       │ name        │───────│ venue_id    │
  │ email       │       │ opening_time│       │ name        │
  │ password    │       │ closing_time│       │ court_type  │
  │ role        │       └─────────────┘       │ price_per_hr│
  └──────┬──────┘                             └──────┬──────┘
         │ 1                                         │ 1
         │                                           │
         │ *                                         │ *
  ┌──────┴───────────────────────────────────────────┴──────┐
  │                        Bookings                         │
  ├─────────────────────────────────────────────────────────┤
  │ id (PK) | user_id (FK) | court_id (FK)                  │
  │ booking_date | start_time | end_time | total_price | status│
  └─────────────────────────────────────────────────────────┘

```

---

## 📂 Project Structure

```
.
├── backend/
│   ├── cmd/server/main.go       # Application entry point
│   ├── config/                  # DB and environment configuration
│   ├── internal/
│   │   ├── handlers/            # HTTP Controllers (Auth, Venue, Booking)
│   │   ├── middleware/          # JWT, CORS, RBAC, and Logger
│   │   ├── models/              # GORM database models
│   │   ├── repositories/        # Database queries & transactions
│   │   ├── routes/              
│   │   ├── services/            # Core business logic & concurrency checks
│   │   └── utils/               # JWT claims & password hashing
│   └── migrations/              # Database SQL migrations
│
└── frontend/
    ├── src/
    │   ├── app/                 # Next.js App Router (pages & layouts)
    │   │   ├── (auth)/          # Login & Register views
    │   │   ├── admin/           # Admin dashboard & management panels
    │   │   ├── bookings/        # Customer booking workflows
    │   │   └── venues/          # Public venue listing & detailed pages
    │   ├── components/          # Reusable UI components
    │   ├── hooks/               # Custom React Query hooks
    │   ├── lib/                 # Axios configuration & validation schemas
    │   └── services/            # API abstraction layer
    └── public/                  # Static assets

```

---

## 🚦 API Endpoints Quick Reference

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register new customer account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate and issue HTTP-only JWT | Public |
| `GET` | `/api/v1/venues` | List active venues with filters | Public |
| `GET` | `/api/v1/courts/:courtId/availability` | Fetch available time slots for a given date | Public |
| `POST` | `/api/v1/bookings` | Create court booking (atomic check) | Customer / Admin |
| `PATCH` | `/api/v1/bookings/:id/cancel` | Cancel existing booking | Customer / Admin |
| `POST` | `/api/v1/venues` | Create venue | Admin |
| `PUT` | `/api/v1/courts/:id` | Modify court state/pricing | Admin |

---

## ⚡ Concurrency & Double-Booking Prevention

To prevent racing conditions where two users attempt to reserve the same slot simultaneously, the **Golang Backend** relies on database-level lock validations inside an isolation transaction rather than frontend state checks:

1. **Explicit Transaction Lock:** The backend opens a transaction (`tx := db.Begin()`).
2. **Conflict Scan Query:**

$$\text{Overlaps} \iff (\text{start\_time} < \text{new\_end\_time}) \land (\text{end\_time} > \text{new\_start\_time})$$


3. **Status Check:** Excludes any bookings marked as `CANCELLED` or `EXPIRED`.
4. **Atomic Commit:** If an overlap exists, the transaction instantly rolls back and returns HTTP `409 Conflict`.

---

## 🚀 Quickstart

### Prerequisites

* Go `1.22+`
* Node.js `18+` & npm/pnpm
* PostgreSQL database instance

### 1. Database Setup

```sql
CREATE DATABASE badminton_db;

```

### 2. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Configure .env with DB credentials
# DB_HOST=localhost DB_PORT=5432 DB_USER=postgres DB_PASSWORD=root DB_NAME=badminton_db JWT_SECRET=your_secret

# Install dependencies and run with live reload
go mod download
go install github.com/air-verse/air@latest
air

```

Backend will start at `http://localhost:8080`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set local API base URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" > .env.local

# Run development server
npm run dev

```

Frontend will start at `http://localhost:3000`.

---

## 🧪 Testing

```bash
# Backend unit & integration tests
cd backend
go test -v ./...

# Prevent double-booking race condition integration test
go test -v ./internal/services/ -run TestDoubleBookingPrevention

```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.