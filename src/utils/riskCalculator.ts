
type PaymentTerm = 'advance' | 'lc' | 'open';
type Incoterm = 'cif' | 'ddp' | 'exw' | 'fob';
type RiskLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

const riskMatrix: Record<Incoterm, Record<PaymentTerm, RiskLevel>> = {
  cif: {
    advance: 'Low',
    lc: 'Medium',
    open: 'High'
  },
  ddp: {
    advance: 'Very Low',
    lc: 'Low',
    open: 'Very High'
  },
  exw: {
    advance: 'Low',
    lc: 'Medium',
    open: 'Very High'
  },
  fob: {
    advance: 'Low',
    lc: 'Medium',
    open: 'High'
  }
};

export const calculateRisk = (incoterm: Incoterm | '', paymentTerm: PaymentTerm | ''): RiskLevel | '' => {
  if (!incoterm || !paymentTerm) return '';
  return riskMatrix[incoterm][paymentTerm];
};

export const getRecommendedDeposit = (riskLevel: RiskLevel | ''): number => {
  switch (riskLevel) {
    case 'High':
    case 'Very High':
      return 50;
    case 'Medium':
      return 25;
    case 'Low':
    case 'Very Low':
      return 10;
    default:
      return 0;
  }
};
