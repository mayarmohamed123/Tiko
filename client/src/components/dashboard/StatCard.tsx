import React, { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string | ReactNode;
  icon?: ReactNode;
  subtitleColor?: string;
  bgColor?: string;
  borderColor?: string;
  className?: string;
  indicator?: ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  subtitleColor = 'text-tiko-on-surface-variant',
  bgColor = 'bg-tiko-surface',
  borderColor = 'border-tiko-surface-container-high',
  className = '',
  indicator,
}) => {
  return (
    <div className={`p-6 rounded-tiko-xl border shadow-sm flex flex-col justify-between relative overflow-hidden ${bgColor} ${borderColor} ${className}`}>
      {indicator && (
        <div className="absolute top-0 left-0 w-full h-1">{indicator}</div>
      )}
      
      {icon ? (
        <>
          <div className="w-10 h-10 bg-tiko-surface-container rounded-full flex items-center justify-center text-tiko-primary mb-4">
            {icon}
          </div>
          <div>
            <p className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-1">{title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-tiko-on-surface">{value}</h3>
              {subtitle && (
                <span className={`text-xs font-medium flex items-center ${subtitleColor}`}>
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-4">{title}</p>
          <div className="flex items-end justify-between mt-auto">
            <h3 className="text-3xl font-bold text-tiko-on-surface">{value}</h3>
            {subtitle && (
              <span className={`text-xs font-bold ${subtitleColor}`}>
                {subtitle}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
