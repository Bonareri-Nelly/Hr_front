# Fix TSC/Vite errors

## Step 1: Resolve Vite runtime import errors
- [x] Fix missing employee self-service payslips imports in `src/app/router/routes.tsx` by removing lazy import to nonexistent payslips module.

## Step 2: Resolve remaining `tsc` build errors (23 total)
- [ ] Fix casing mismatch for DashboardLayout import/file.
- [ ] Fix HR dashboard branch-indexing typing errors in:
  - [ ] `DistributionChart.tsx`
  - [ ] `QuickStats.tsx`
  - [ ] `UpcomingEvents.tsx`
  - [ ] `HrDashboardPage.tsx`
- [ ] Fix implicit any / unknown issues in:
  - [ ] `PerformanceOversightPage.tsx`

## Step 3: Re-run
- [ ] `npx tsc -p tsconfig.json --noEmit`
- [ ] `npm run build`

