
export const getStatusBadgeColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'booked': return 'bg-green-100 text-green-800';
    case 'expected': return 'bg-blue-100 text-blue-800';
    case 'requested': return 'bg-yellow-100 text-yellow-800';
    case 'delayed': return 'bg-orange-100 text-orange-800';
    case 'not enough': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
