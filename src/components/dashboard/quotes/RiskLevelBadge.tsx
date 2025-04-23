
import React from 'react';

interface RiskLevelBadgeProps {
  risk: string | null | undefined;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({ risk }) => {
  return (
    <span className={`inline-block px-2 py-1 rounded ${
      risk === 'High' || risk === 'Very High' 
        ? 'bg-red-100 text-red-800' 
        : risk === 'Medium'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800'
    }`}>
      {risk || 'Not calculated'}
    </span>
  );
};
