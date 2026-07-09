import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AssetsViewProps {
  caseId: string;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ caseId }) => {
  return (
    <Card className="bg-navy-700/50 border-gold-500/20">
      <CardHeader>
        <CardTitle className="text-white">Assets & Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">Offboarding case ID: {caseId}</p>
        <p className="text-sm text-gray-400">
          Asset return and access revocation details are being prepared. This placeholder ensures the
          offboarding flow compiles while the final implementation is added.
        </p>
      </CardContent>
    </Card>
  );
};
