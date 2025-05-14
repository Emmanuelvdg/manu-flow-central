
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '$0.00';
  try {
    return `$${value.toFixed(2)}`;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `$${String(value)}`;
  }
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};
