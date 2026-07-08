// src/features/benefits/routes.tsx
import type { RouteObject } from 'react-router-dom';
import { Dashboard } from './management/pages/Dashboard';

export const benefitsRoutes: RouteObject[] = [
  {
    path: 'benefits',
    children: [
      {
        index: true,
        element: <Dashboard role="Executive" />,
      },
    ],
  },
];