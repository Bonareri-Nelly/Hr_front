# Optimum HR & Payroll Management System

A full-stack HR & Payroll platform built with React + TypeScript + Vite (frontend) and Django REST Framework (backend).

## Architecture

| Layer | Stack | Port |
|---|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, TanStack Query | 5173 |
| Backend | Django 6, Django REST Framework, SimpleJWT | 8000 |
| Database | SQLite (`backend/db.sqlite3`) | — |

The Vite dev server proxies all `/api/*` requests to the Django backend on port 8000, so the frontend never needs to know the backend URL directly.

## Running the Project

Both workflows start automatically:

- **Frontend** — `npm run dev` → http://localhost:5173
- **Backend** — `cd backend && python manage.py runserver 0.0.0.0:8000`

## Demo Credentials

| Role | Username | Password |
|---|---|---|
| System Admin | `admin` | `Admin1234!` |
| Executive | `executive` | `Pass1234!` |
| HR Manager | `hr_manager` | `Pass1234!` |
| Finance | `finance_manager` | `Pass1234!` |
| Department Head | `dept_head` | `Pass1234!` |
| Manager | `manager` | `Pass1234!` |
| Employee | `employee1` | `Pass1234!` |

## Backend Structure

```
backend/
  manage.py
  config/           # Django settings, root URLs
  apps/
    authentication/ # Custom User model, JWT auth
    employees/      # Branches, Departments, Employees, Documents…
    attendance/     # Shifts, Records, Check-in/out
    leave/          # Leave types, balances, requests, approvals
    payroll/        # Payroll runs, payslips, tax bands, components
    benefits/       # Benefit plans, windows, enrollments
    contracts/      # Contracts, renewals, terminations
    performance/    # Cycles, goals, reviews
    hr_operations/  # Announcements, trainings, disciplinary cases
    seed/           # Demo data command
```

## Useful Commands

```bash
# Re-seed demo data
cd backend && python manage.py seed_data

# Create a superuser
cd backend && python manage.py createsuperuser

# Django admin
# http://localhost:8000/admin/

# Run TypeScript checks
npx tsc --noEmit
```

## Design System

All colours, typography, and spacing flow from CSS custom properties in `src/styles/theme.css`. The core palette:

- **Navy** (`--navy-deepest`, `--navy-dark`, `--navy-mid`) — sidebar and primary buttons
- **Gold** (`--gold`, `--gold-light`, `--bronze`) — accents and active states
- **Ink / Surface / Background** — content hierarchy
- **Status colours** (`--success`, `--warning`, `--danger`, `--info`) — semantic feedback

## User Preferences

- Keep existing project structure — do not restructure or rename top-level folders.
- Use CSS custom properties from `src/styles/theme.css` for all colour values; never hardcode hex/rgb colours in component CSS.
- Backend lives in `backend/`; do not move it.
