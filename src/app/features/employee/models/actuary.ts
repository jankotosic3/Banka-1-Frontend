export interface Actuary {
  id?: number;
  employeeId: number;
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  limit: number;
  usedLimit: number;
  needApproval: boolean;
}
