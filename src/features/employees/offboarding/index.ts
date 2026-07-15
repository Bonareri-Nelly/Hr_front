// src/features/employees/offboarding/index.ts
import OffboardingDashboard from './pages/Dashboard';

export { OffboardingDashboard };
export { offboardingService } from './services/offboarding.service';
export { useOffboarding } from './hooks/useOffboarding';
export * from './types';

export default OffboardingDashboard;