
// Calculate total material items
export const calculateTotalMaterialItems = (materials: any[] = []): number => {
  return materials.length;
};

// Calculate total stages
export const calculateTotalStages = (stages: any[] = []): number => {
  return stages.length;
};

// Calculate total personnel hours across all stages
export const calculateTotalPersonnelHours = (stages: any[] = []): number => {
  return stages.reduce((total, stage) => {
    const personnelHours = (stage.personnel || []).reduce(
      (hours: number, person: any) => hours + (Number(person.hours) || 0), 
      0
    );
    return total + personnelHours;
  }, 0);
};

// Calculate total machine hours across all stages
export const calculateTotalMachineHours = (stages: any[] = []): number => {
  return stages.reduce((total, stage) => {
    const machineHours = (stage.machines || []).reduce(
      (hours: number, machine: any) => hours + (Number(machine.hours) || 0), 
      0
    );
    return total + machineHours;
  }, 0);
};

// Format currency to USD
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Calculate material cost
export const calculateMaterialCost = (quantity: number, costPerUnit: number): number => {
  return quantity * costPerUnit;
};
