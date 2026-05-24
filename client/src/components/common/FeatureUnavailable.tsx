import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FeatureUnavailableProps {
  title?: string;
  description: string;
}

export const FeatureUnavailable: React.FC<FeatureUnavailableProps> = ({
  title = 'API not available yet',
  description,
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
    <div>
      <p className="font-outfit font-bold">{title}</p>
      <p className="mt-0.5 text-amber-800">{description}</p>
    </div>
  </div>
);
