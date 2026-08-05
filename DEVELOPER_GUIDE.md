# Developer Quick Reference Guide

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm lint
```

## Key Files and Directories

### Payroll Module
- **Routes:** `src/app/router/routes.tsx` (lines 47-52)
- **Components:** `src/features/payroll/`
- **Shared Workspace:** `src/features/payroll/shared/PayrollWorkspace.tsx`
- **Hooks:** `src/features/payroll/*/hooks/`

### Employee Self-Service
- **Routes:** `src/app/router/routes.tsx` (lines 58-72)
- **Components:** `src/features/employee-self-service/`
- **Dashboard:** `src/features/dashboards/employee/pages/EmployeeDashboardPage.tsx`

### Role-Based Access Control
- **Configuration:** `src/constants/roleModuleMap.ts`
- **Router Guard:** `src/app/router/AppRouter.tsx`

## Type Safety Patterns

### Working with ApiRecord

```typescript
// ✅ CORRECT: Type-safe property access
const name = String(record.name ?? record.plan_name ?? "Default");
const amount = Number(record.amount ?? 0);

// ❌ INCORRECT: Unsafe property access
const name = record.name;  // Could be undefined
const amount = record.amount;  // Could be undefined
```

### Query Data Transformation

```typescript
// ✅ CORRECT: Map API data to typed interface
const { data: runs } = useQuery<PayrollRun[]>({
  queryKey: ["payroll-runs"],
  queryFn: async () => {
    const data = await resources.payrollRuns.list();
    return (data as any[]).map((run: any) => ({
      id: run.id,
      name: run.name,
      // ... map all required properties
    }));
  },
});

// ❌ INCORRECT: Direct type assertion
const { data: runs } = useQuery<PayrollRun[]>({
  queryKey: ["payroll-runs"],
  queryFn: () => resources.payrollRuns.list() as any,
});
```

## Common Fixes Applied

### Fix 1: Type Mismatch in Hooks
**Problem:** `ApiRecord[]` returned from API doesn't match `PayrollRun[]` interface
**Solution:** Add mapping function in query function to transform data

### Fix 2: Missing Property Types
**Problem:** `ApiRecord` properties are `unknown` type
**Solution:** Wrap with `String()` or `Number()` for type safety

### Fix 3: Optional Property Access
**Problem:** Property might be undefined
**Solution:** Use nullish coalescing with fallback chains

### Fix 4: Date Parsing
**Problem:** Date string might be undefined
**Solution:** Add type guard: `typeof value === 'string'`

## Testing the Fixes

### Build Verification
```bash
npm run build
# Should complete with zero errors
```

### Type Checking
```bash
npx tsc --noEmit
# Should report zero errors
```

### Component Testing
```typescript
// Test employee dashboard loads
const { getByText } = render(<EmployeeDashboardPage />);
expect(getByText(/Welcome back/)).toBeInTheDocument();

// Test benefits enrollment
const { getByRole } = render(<MyBenefitsPage />);
fireEvent.click(getByRole('button', { name: /Enroll/ }));
```

## Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Build completes successfully
- [ ] No console errors or warnings
- [ ] All role-based routes work
- [ ] API integration verified
- [ ] Performance acceptable
- [ ] Security review completed

## Troubleshooting

### Build Fails with Type Errors
1. Run `npm install` to ensure dependencies are current
2. Check `tsconfig.app.json` for strict mode settings
3. Verify all `ApiRecord` properties are wrapped with type conversions

### Pages Not Loading
1. Check browser console for errors
2. Verify role-based access in `roleModuleMap.ts`
3. Ensure API endpoints are accessible
4. Check network tab for failed requests

### Data Not Displaying
1. Verify query hooks are properly typed
2. Check data transformation in query functions
3. Ensure employee ID is properly scoped
4. Verify API response structure matches expectations

## Performance Tips

- Use React Query's `select` option to filter data client-side
- Implement pagination for large datasets
- Use `React.memo` for expensive components
- Lazy load routes with `React.lazy()`
- Monitor bundle size with `npm run build`

## Code Style

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use nullish coalescing (`??`) over OR (`||`)
- Add type annotations for function parameters
- Use meaningful variable names
- Keep components under 300 lines

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

---

**Last Updated:** August 5, 2026
**Maintainer:** Manus AI
