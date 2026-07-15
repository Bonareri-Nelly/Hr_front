// src/features/employees/onboarding/index.ts
import OnboardingDashboard from './pages/Dashboard';

export { OnboardingDashboard };
export { onboardingService } from './services/onboarding.service';
export { useOnboarding } from './hooks/useOnboarding';
export * from './types';

export default OnboardingDashboard;