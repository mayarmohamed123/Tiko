import React from 'react';
import { StatCard } from './StatCard';
import { 
  ClipboardList, 
  Package, 
  CircleDollarSign, 
  Users, 
  AlertTriangle, 
  TrendingUp 
} from 'lucide-react';

export const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <StatCard 
        title="Total Products"
        value="1,284"
        icon={<ClipboardList className="w-5 h-5" />}
        subtitle={<><TrendingUp className="w-3 h-3 mr-1" /> 12% increase</>}
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard 
        title="Orders"
        value="452"
        icon={<Package className="w-5 h-5" />}
        subtitle={<><TrendingUp className="w-3 h-3 mr-1" /> 8% increase</>}
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard 
        title="Revenue"
        value="$24,500"
        icon={<CircleDollarSign className="w-5 h-5" />}
        subtitle={<><TrendingUp className="w-3 h-3 mr-1" /> 24% increase</>}
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard 
        title="Customers"
        value="892"
        icon={<Users className="w-5 h-5" />}
        subtitle={<><TrendingUp className="w-3 h-3 mr-1" /> 5% increase</>}
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard 
        title="Low Stock"
        value="14 Items"
        icon={<AlertTriangle className="w-5 h-5" />}
        subtitle="Attention required"
        subtitleColor="text-tiko-error"
        bgColor="bg-tiko-surface"
        borderColor="border-tiko-error-container"
        className="h-40"
        indicator={<div className="w-full h-full bg-tiko-error"></div>}
      />
    </div>
  );
};
