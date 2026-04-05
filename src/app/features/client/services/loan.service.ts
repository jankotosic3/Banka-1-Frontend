import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators'; // Dodat delay za bolju simulaciju
import { environment } from '../../../../environments/environment';
import { Loan, LoanType, Installment } from '../models/loan.model'; // Ažurirani importi

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly baseUrl = `${environment.apiUrl}/api/loans/my-loans`;

  constructor(private readonly http: HttpClient) {}

  getMyLoans(): Observable<Loan[]> {
    const mockLoans: Loan[] = [
      {
        id: 'loan-001',
        currency: 'RSD',
        status: 'APPROVED',
        type: 'MORTGAGE',
        number: 'LN-2024-001',
        amount: 2500000,
        createdDate: '2022-06-15T10:30:00Z',
        maturityDate: '2042-06-15T10:30:00Z',
        remainingBalance: 2350000,
        interestRate: 4.5,
        loanType: 'MORTGAGE',
        loanNumber: 'LN-2024-001',
        totalAmount: 2500000,
        repaymentPeriod: 240,
        nominalInterestRate: 4.5,
        effectiveInterestRate: 4.8,
        contractDate: '2022-06-15T10:30:00Z',
        dueDate: '2042-06-15T10:30:00Z',
        nextInstallmentAmount: 15800,
        nextInstallmentDate: '2024-05-15T10:30:00Z',
        remainingDebt: 2350000
      },
      {
        id: 'loan-002',
        currency: 'EUR',
        status: 'OVERDUE',
        type: 'PERSONAL',
        number: 'LN-2023-089',
        amount: 5000,
        createdDate: '2023-01-10T10:30:00Z',
        maturityDate: '2028-01-10T10:30:00Z',
        remainingBalance: 4200,
        interestRate: 8.5,
        loanType: 'PERSONAL',
        loanNumber: 'LN-2023-089',
        totalAmount: 5000,
        repaymentPeriod: 60,
        nominalInterestRate: 8.5,
        effectiveInterestRate: 9.1,
        contractDate: '2023-01-10T10:30:00Z',
        dueDate: '2028-01-10T10:30:00Z',
        nextInstallmentAmount: 105,
        nextInstallmentDate: '2024-05-10T10:30:00Z',
        remainingDebt: 4200
      },
      {
        id: 'loan-003',
        currency: 'RSD',
        status: 'REPAID',
        type: 'AUTO',
        number: 'LN-2020-045',
        amount: 1200000,
        createdDate: '2020-03-01T10:30:00Z',
        maturityDate: '2024-03-01T10:30:00Z',
        remainingBalance: 0,
        interestRate: 6.0,
        loanType: 'AUTO',
        loanNumber: 'LN-2020-045',
        totalAmount: 1200000,
        repaymentPeriod: 48,
        nominalInterestRate: 6.0,
        effectiveInterestRate: 6.5,
        contractDate: '2020-03-01T10:30:00Z',
        dueDate: '2024-03-01T10:30:00Z',
        nextInstallmentAmount: 0,
        nextInstallmentDate: undefined,
        remainingDebt: 0
      },
      {
        id: 'loan-004',
        currency: 'RSD',
        status: 'REJECTED',
        type: 'BUSINESS',
        number: 'LN-REQ-009',
        amount: 5000000,
        createdDate: '2024-04-01T10:30:00Z',
        maturityDate: undefined,
        remainingBalance: 5000000,
        interestRate: 0,
        loanType: 'BUSINESS',
        loanNumber: 'LN-REQ-009',
        totalAmount: 5000000,
        repaymentPeriod: 0,
        nominalInterestRate: 0,
        effectiveInterestRate: 0,
        contractDate: undefined,
        dueDate: undefined,
        nextInstallmentAmount: 0,
        nextInstallmentDate: undefined,
        remainingDebt: 0
      }
    ];

    return of(this.sortLoansByAmount(mockLoans)).pipe(delay(300));
  }

  getLoanById(id: string | number): Observable<Loan> {
    const mockLoan: Loan = {
        id: id,
        currency: 'RSD',
        status: 'APPROVED',
        
        // Za loan-list
        type: LoanType.MORTGAGE,
        number: 'LN-2024-001',
        amount: 2500000,
        createdDate: '2022-06-15T10:30:00Z',
        maturityDate: '2042-06-15T10:30:00Z',
        remainingBalance: 2350000,
        interestRate: 4.5,
        monthlyPayment: 15800,

        // Za loan-details
        loanType: 'MORTGAGE',
        loanNumber: 'LN-2024-001',
        totalAmount: 2500000,
        repaymentPeriod: 240,
        nominalInterestRate: 4.5,
        effectiveInterestRate: 4.8,
        contractDate: '2022-06-15T10:30:00Z',
        dueDate: '2042-06-15T10:30:00Z',
        nextInstallmentAmount: 15800,
        nextInstallmentDate: '2024-05-15T10:30:00Z',
        remainingDebt: 2350000
    };
    return of(mockLoan).pipe(delay(300));
  }

  getLoanInstallments(loanId: string | number): Observable<Installment[]> {
    const mockInstallments: Installment[] = [
      {
        expectedDueDate: new Date('2024-03-15').toISOString(),
        actualPaymentDate: new Date('2024-03-14').toISOString(),
        amount: 15800,
        currency: 'RSD',
        interestRateAtPayment: 4.5,
        status: 'PAID'
      },
      {
        expectedDueDate: new Date('2024-04-15').toISOString(),
        actualPaymentDate: null,
        amount: 15800,
        currency: 'RSD',
        interestRateAtPayment: 4.5,
        status: 'UNPAID'
      }
    ];
    return of(mockInstallments).pipe(delay(300));
  }

  private sortLoansByAmount(loans: Loan[]): Loan[] {
    return loans.sort((a, b) => (b.amount || 0) - (a.amount || 0));
  }
}