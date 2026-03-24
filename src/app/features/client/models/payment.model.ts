/**
 * Status plaćanja
 */
export type PaymentStatus = 'REALIZED' | 'PROCESSING' | 'REJECTED';

/**
 * Model za prikaz plaćanja u listi
 */
export interface Payment {
  /** ID plaćanja */
  id: number;
  /** Datum plaćanja */
  date: string;
  /** Naziv platioca */
  payerName: string;
  /** Valuta */
  currency: string;
  /** Iznos plaćanja (pozitivan ili negativan) */
  amount: number;
  /** Status plaćanja */
  status: PaymentStatus;
  /** Broj računa platioca */
  payerAccountNumber?: string;
  /** Broj računa primaoca */
  recipientAccountNumber?: string;
  /** Svrha plaćanja */
  purpose?: string;
  /** Poziv na broj */
  referenceNumber?: string;
  /** Šifra plaćanja */
  paymentCode?: string;
}

/**
 * Paginirana lista plaćanja
 */
export interface PaymentPage {
  content: Payment[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

/**
 * Filteri za pretragu plaćanja
 */
export interface PaymentFilters {
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
  status?: PaymentStatus | '';
}
