# HR & Payroll System — Operating Runbook

The system is two repositories that run side by side:

| Part | Location | Dev URL |
|---|---|---|
| Backend (Django REST API) | `c:\Users\is\Desktop\Optimum-Project-Hr-Payroll-Management-System` | http://127.0.0.1:8000 |
| Frontend (React + Vite) | `c:\Users\is\Desktop\Hr_front` | http://localhost:5173 |

The frontend reads its API URL from `Hr_front\.env`:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

The backend allows browser requests from `localhost:5173` and `127.0.0.1:5173`
(`CORS_ALLOWED_ORIGINS` in `config/settings.py`). If you change the frontend
port, add it there too or every request will fail CORS.

---

## 1. Always use the virtualenv Python

The backend's dependencies are installed in its `venv`, **not** in the system
Python. Bare `python manage.py ...` fails with
`ModuleNotFoundError: No module named 'drf_spectacular'`.

```powershell
cd c:\Users\is\Desktop\Optimum-Project-Hr-Payroll-Management-System
.\venv\Scripts\python.exe manage.py check
```

Use `.\venv\Scripts\python.exe` for every backend command in this document.

---

## 2. Starting the system (two terminals)

**Terminal 1 — backend**

```powershell
cd c:\Users\is\Desktop\Optimum-Project-Hr-Payroll-Management-System
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

**Terminal 2 — frontend**

```powershell
cd c:\Users\is\Desktop\Hr_front
npm run dev
```

Then open http://localhost:5173.

> **Before you start:** make sure no old server is already holding port 8000. A
> stale server keeps serving old code, so new endpoints return 404 and you will
> chase bugs that are already fixed. See *Troubleshooting*.

---

## 3. One-time (and after any permission change) — seed reference data

Order matters: roles, then permissions, then permission groups.

```powershell
cd c:\Users\is\Desktop\Optimum-Project-Hr-Payroll-Management-System
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py seed_roles
.\venv\Scripts\python.exe manage.py seed_permissions
.\venv\Scripts\python.exe manage.py seed_permission_groups
.\venv\Scripts\python.exe manage.py seed_payroll_config
.\venv\Scripts\python.exe manage.py seed_pay_components
```

`seed_permissions` is safe to re-run; it updates in place. It prints each role's
data scope, which is the thing most likely to be wrong:

```
  HR: 40 permissions at ORGANIZATION scope
  MANAGER: 18 permissions at DEPARTMENT scope
  EMPLOYEE: 11 permissions at OWN scope
```

**Re-run `seed_permissions` whenever you add a permission to a view**, otherwise
the permission does not exist in the database and the endpoint returns 403 for
everyone except superusers.

---

## 4. Logging in

Login uses **username**, not email. Existing accounts:

| Username | Role |
|---|---|
| `James` | SUPER_ADMIN |
| `sly` | HR |
| `Jimmy` | EMPLOYEE |

If you do not know a password, set one:

```powershell
.\venv\Scripts\python.exe manage.py changepassword James
```

To create a fresh administrator:

```powershell
.\venv\Scripts\python.exe manage.py createsuperuser
```

New accounts created through the public `/api/auth/register/` endpoint start
with `is_approved = False` and must be approved by an admin
(`POST /api/auth/approve/<user_id>/`). Accounts created by an admin through the
user-management screen are approved immediately.

---

## 5. Roles and what each one sees

Two things decide what a user can do:

1. **Permission** — may they call this endpoint at all (`employees.view`, …).
2. **Data scope** — which rows come back (`OWN`, `DEPARTMENT`, `ORGANIZATION`).

| Role | Scope | Sees |
|---|---|---|
| SUPER_ADMIN, ADMIN | ORGANIZATION | Everything, plus user management |
| HR | ORGANIZATION | All employees, payroll, contracts, reports |
| FINANCE, PAYROLL_OFFICER | ORGANIZATION | Payroll, salary, reports |
| EXECUTIVE | ORGANIZATION | Read-only company-wide reporting |
| MANAGER, DEPARTMENT_HEAD | DEPARTMENT | Their own department only |
| EMPLOYEE | OWN | Only their own records |

> **Important:** a user on `OWN` or `DEPARTMENT` scope must be linked to an
> Employee record, or they see **nothing at all**. Link `CustomUser.employee_profile`
> (the `user` field on `Employee`) via Django admin at
> http://127.0.0.1:8000/admin/. Users on `ORGANIZATION` scope do not need a link.

Only `ADMIN` and `SUPER_ADMIN` hold `accounts.manage`, so only they can list or
create users (`/api/auth/roles/`, `/api/auth/users/`). HR getting 403 on those
two endpoints is intentional; grant HR `accounts.manage` in
`seed_permissions.py` if you want HR provisioning accounts.

---

## 6. Health check

```powershell
cd c:\Users\is\Desktop\Optimum-Project-Hr-Payroll-Management-System
.\venv\Scripts\python.exe manage.py check
.\venv\Scripts\python.exe manage.py makemigrations --check --dry-run   # expect "No changes detected"
```

```powershell
cd c:\Users\is\Desktop\Hr_front
npx tsc -b        # expect no output
npm run build
```

Interactive API browser (needs a logged-in session or token):
http://127.0.0.1:8000/api/docs/

---

## 7. Troubleshooting

**New endpoints return 404, or fixes seem to have no effect.**
An old server is still bound to port 8000. Find and stop it:

```powershell
Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
  Where-Object { $_.CommandLine -like '*runserver*' } |
  Select-Object ProcessId, CommandLine
```

```powershell
Stop-Process -Id <PID> -Force
```

Then restart. A second `runserver` cannot bind an occupied port, so it exits
while the old one keeps answering — which looks exactly like your change did
nothing.

**`ModuleNotFoundError: No module named 'drf_spectacular'`**
You used system Python. Use `.\venv\Scripts\python.exe`.

**Everything returns 403 for a real user.**
The permission is missing from the database. Run `seed_permissions`.

**A page loads but every list is empty.**
The user is on `OWN`/`DEPARTMENT` scope with no linked Employee record, or
`DEPARTMENT` scope with no department set on their Employee record. See §5.

**Login succeeds but requests are unauthorized.**
The app keeps three token key styles in `localStorage` (`accessToken`,
`access_token`, `hr_payroll_access_token`) because three axios instances read
different keys. Logging out and back in rewrites all of them; clearing
`localStorage` by hand and reloading also works.

**Browser console shows CORS errors.**
The frontend origin is not in `CORS_ALLOWED_ORIGINS` in `config/settings.py`.

---

## 8. Known gaps (not bugs to chase)

These render empty because the data does not exist yet, not because the wiring
is broken:

- **Benefits** cards — there are `0` benefit plans and `0` enrollments. Add
  plans under `/api/benefits/plans/` or Django admin.
- **Performance** analytics — populate by creating an appraisal cycle and
  submitting reviews on the Performance Oversight page.
- **Payroll budget variance** always reports zero: there is no budget model, so
  budget is reported as actual rather than invented.
- **Statutory compliance** infers "filed" from payroll-run approval, so all four
  statutory rows share one basis. A real per-obligation filing model would make
  them differ.
- **Branch dashboard notifications and recent-activity** are still client-side
  only. Tasks now persist (see below); these two do not.
- **User profile documents and activity feed** render empty — the profile page
  does not yet read `/api/documents/` or `/api/audit/logs/`.

Pagination defaults to 20 rows per page (`PAGE_SIZE` in `config/settings.py`).
Any screen that totals a list fetched from `/api/employees/` without following
`next` is computing over the first 20 rows only.

---

## 9. Endpoints added for the client

These were added so the UI's forms have somewhere to save to. All are verified
creating, updating and deleting.

| Endpoint | Backs |
|---|---|
| `/api/auth/roles/`, `/api/auth/users/` | User provisioning screen (needs `accounts.manage`) |
| `/api/employees/lifecycle/` | Employee Lifecycle page (`{employees, analytics}`) |
| `/api/contracts/<id>/approve/` | Contract approval |
| `/api/reporting/dashboard/compliance/` | Statutory Compliance card |
| `/api/reporting/dashboard/benefits/` | Benefits Utilization card |
| `/api/reporting/schedules/` | Scheduled Reports panel |
| `/api/hr-operations/performance-cycles/` | Appraisal cycles |
| `/api/hr-operations/branch-tasks/` | Branch dashboard task board |
| `/api/hr-operations/employee-notes/` | Lifecycle and finance notes |

Two notes on shape:

- The **appraisal cycle** endpoint is under `hr-operations`, not `performance`.
  Both apps define a cycle model; only the `hr_operations` one carries the
  `name`, `review_period`, `rating_scale` and `employee_status` fields the page
  reads. `/api/performance/cycles/` is a different model keyed on `title`.
- **Performance goals** can now belong to an employee directly (`employee`) as
  well as to a review, because the UI sets goals before any review exists. A
  goal with neither is rejected with a 400.

`Employee.full_name` is a property, not a column. Roughly ten serializers expose
it; before it existed DRF silently resolved it to `null`, so payslips, contracts
and employee lists all returned blank names.

**Quick-add employee** (HR dashboard) requires branch, department, designation
and a non-zero basic salary — the API rejects an employee without them, so the
form presents them as dropdowns loaded from `/api/branches/`, `/api/departments/`
and `/api/designations/`.
