# RBAC Sidebar and Header QA Checklist

Use this checklist after pulling or merging work that touches routes, login, users, roles, or navigation.

## Seed and Login

- Run backend migrations before testing RBAC changes.
- Run `python manage.py seed_roles`.
- For local demo users, run `python manage.py seed_rbac_users --password ChangeMe123!`.
- Log in once for each role: System Admin, Executive, Manager, HR, Department Head, Finance, Employee.

## Sidebar

- Each role only sees its assigned modules.
- Empty section headers do not render.
- System Admin sees Administration modules: Security & Audit and System Settings.
- Non-admin roles do not see System Settings or Security & Audit.
- User Profile is available to every signed-in role under Account.

## Header

- Branch is shown as static text, not a dropdown.
- Page title changes when navigating between modules.
- Role badge reflects the signed-in user role from the session.
- System Settings icon appears only for System Admin.

## Direct URL Access

- A signed-out user visiting a protected URL is redirected to login.
- A signed-in user visiting an unauthorized URL is redirected to their role dashboard.
- A signed-in user visiting an unknown URL is redirected to their role dashboard.

## Merge Safety

- New modules must be added to `src/constants/navigation.ts`.
- New modules must be assigned in `src/constants/roleModuleMap.ts` before they appear for users.
- New backend roles should be added to `seed_roles.py` and normalized in `src/services/permissions/permissions.ts`.
