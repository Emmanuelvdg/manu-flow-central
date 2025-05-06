
// Format currency helper
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Calculate total material items
export const calculateTotalMaterialItems = (materials: any[]) => {
  return materials.length;
};

// Calculate total stages
export const calculateTotalStages = (routingStages: any[]) => {
  return routingStages.length;
};

// Calculate total personnel hours
export const calculateTotalPersonnelHours = (routingStages: any[]) => {
  return routingStages.reduce(
    (sum, stage) => sum + (stage.personnel || []).reduce((s, p) => s + (p.hours || 0), 0),
    0
  );
};

// Calculate total machine hours
export const calculateTotalMachineHours = (routingStages: any[]) => {
  return routingStages.reduce(
    (sum, stage) => sum + (stage.machines || []).reduce((s, m) => s + (m.hours || 0), 0),
    0
  );
};
