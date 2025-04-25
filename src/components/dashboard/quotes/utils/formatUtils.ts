
// Safe date formatting function
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateString);
  }
};

// Safe currency formatting function
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '$0';
  try {
    return `$${value.toLocaleString()}`;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `$${String(value)}`;
  }
};
