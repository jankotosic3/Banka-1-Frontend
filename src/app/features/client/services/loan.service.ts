import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Installment,
  Loan,
  LoanPage,
  LoanRequest,
  LoanStatus,
  LoanType,
  InterestRateType
} from '../models/loan.model';

export interface LoanRequestFilters {
  loanType?: LoanType | string | '';
  accountNumber?: string;
}

export interface EmployeeLoanFilters {
  loanType?: LoanType | string | '';
  accountNumber?: string;
  status?: LoanStatus | string | '';
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly loansUrl = `${environment.apiUrl}/credit/api/loans`;
  private readonly myLoansUrl = `${environment.apiUrl}/credit/api/loans/client`;
  private readonly requestsUrl = `${environment.apiUrl}/credit/api/loans/requests`;

  constructor(private readonly http: HttpClient) {}

  getMyLoans(): Observable<Loan[]> {
    return this.http.get<LoanPage<Loan>>(this.myLoansUrl).pipe(
      map(page => page.content || [])
    );
  }

  getLoanById(id: string | number): Observable<Loan> {
    return this.http.get<Loan>(`${this.myLoansUrl}/${id}`);
  }

  getLoanInstallments(loanId: string | number): Observable<Installment[]> {
    return this.http.get<Installment[]>(`${this.myLoansUrl}/${loanId}/installments`);
  }

  getLoanRequests(
    filters: LoanRequestFilters = {},
    page = 0,
    size = 10
  ): Observable<LoanPage<LoanRequest>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'submittedAt,desc');

    if (filters.loanType) {
      params = params.set('loanType', String(filters.loanType));
    }

    if (filters.accountNumber?.trim()) {
      params = params.set('accountNumber', filters.accountNumber.trim());
    }

    // TODO
    return this.http.get<LoanPage<LoanRequest>>(this.requestsUrl, { params });
  }

  approveLoanRequest(requestId: number): Observable<string> {
    return this.http.put<string>(`${this.requestsUrl}/${requestId}/approve`, {}, { responseType: 'text' as 'json' });
  }

  rejectLoanRequest(requestId: number): Observable<string> {
    return this.http.put<string>(`${this.requestsUrl}/${requestId}/decline`, {}, { responseType: 'text' as 'json' });
  }

  requestLoan(loanRequestDto: any): Observable<any> {
    return this.http.post<any>(`${this.requestsUrl}`, loanRequestDto);
  }

  getAllLoans(
    filters: EmployeeLoanFilters = {},
    page = 0,
    size = 10
  ): Observable<LoanPage<Loan>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'accountNumber,asc');

    if (filters.loanType) {
      params = params.set('loanType', String(filters.loanType));
    }

    if (filters.accountNumber?.trim()) {
      params = params.set('accountNumber', filters.accountNumber.trim());
    }

    if (filters.status) {
      params = params.set('status', String(filters.status));
    }

    // TODO
    return this.http.get<LoanPage<Loan>>(this.loansUrl + '/all', { params });
  }

  getEmployeeLoanById(id: string | number): Observable<Loan> {
    // TODO
    return this.http.get<Loan>(`${this.loansUrl}/${id}`);
  }

  getEmployeeLoanInstallments(loanId: string | number): Observable<Installment[]> {
    // TODO
    return this.http.get<Installment[]>(`${this.loansUrl}/${loanId}/installments`);
  }
}
