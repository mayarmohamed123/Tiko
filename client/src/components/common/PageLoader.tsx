import React from 'react';

export const PageLoader: React.FC = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-tiko-primary border-t-transparent" />
  </div>
);
