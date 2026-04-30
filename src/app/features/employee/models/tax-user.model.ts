export interface TaxUser {
  firstName: string;
  lastName: string;
  userType: 'CLIENT' | 'ACTUARY';
  taxDebtRsd: number;
}

export interface TaxUserDisplay {
  firstName: string;
  lastName: string;
  type: 'CLIENT' | 'ACTUARY';
  baseAmount: number;
  taxDebt: number;
}