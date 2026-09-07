export interface OciCostRow {
  'lineItem/id': string;
  'lineItem/resourceId': string;
  'product/service': string;
  'product/region': string;
  'lineItem/compartmentName': string;
  'lineItem/usageAmount': number;
  'cost/amortized': number;
  'lineItem/intervalUsageStart': string; // ISO 8601 string
  'tags/OrgTags.app'?: string;
  'tags/OrgTags.cost_center'?: string;
}

export interface FocusDataRow {
  id: string;
  resourceId: string;
  service: string;
  region: string;
  compartment: string;
  usageAmount: number;
  cost: number;
  timestamp: Date;
  appTag?: string;
  costCenterTag?: string;
}

export interface KpiMetrics {
  mtdCost: number;
  projectedCost: number;
  lastMonthCost: number;
  previousMonthTotalCost: number;
  untaggedPercentage: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ContractYear {
  year: number;
  allocated: number;
  consumed: number;
}

export interface CostCenterContract {
  name: string;
  displayName: string;
  years: ContractYear[];
}

export interface CreditTranche {
  id: string;
  name: string;
  entity: string;
  allocated: number;
  consumed: number;
  expirationDate: string; // ISO date or formatted
  daysToExpiration: number;
  status: 'optimal' | 'warning_underuse' | 'warning_expiring' | 'depleted';
  discountPercentage: number;
}

export interface ContractCreditsData {
  contractId: string;
  startDate: string;
  endDate: string;
  totalCommitment: number;
  totalConsumed: number;
  dailyBurnRate: number;
  costCenters: CostCenterContract[];
  currentYear: number;
  tranches: CreditTranche[];
}


export interface SavingsOpportunity {
  id: string;
  title: string;
  category: 'Cómputo Inactivo' | 'Almacenamiento Huérfano' | 'Ajuste de Talla (Right-Sizing)' | 'Base de Datos' | 'Compromisos Flex';
  estimatedMonthlySavings: number;
  resourceCount: number;
  effort: 'Bajo' | 'Medio' | 'Alto';
  description: string;
  recommendation: string;
  impactLevel: 'Alto' | 'Medio' | 'Crítico';
}

export interface FocusData {
  kpis: KpiMetrics;
  dailySpend: ChartDataPoint[];
  spendByService: ChartDataPoint[];
  spendByApp: ChartDataPoint[];
  treemapData: any[]; // Define more strictly if possible
  hourlyHeatmapData: { hour: string; days: { day: string; value: number }[] }[];
  topSpenders: { name: string; cost: number; type: 'App' | 'Service' }[];
  regionSpend: ChartDataPoint[];
  tagHygiene: { tagged: number; untagged: number };
  contractCredits: ContractCreditsData;
  savingsOpportunities: SavingsOpportunity[];
}
