import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Loan, LoanType, Installment } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly baseUrl = `${environment.apiUrl}/api/loans/my-loans`;

  constructor(private readonly http: HttpClient) {}

  getMyLoans(): Observable<Loan[]> {
    // TODO
    return this.http.get<Loan[]>(this.baseUrl);
  }

  getLoanById(id: string | number): Observable<Loan> {
    // TODO
    return this.http.get<Loan>(`${this.baseUrl}/${id}`);
  }

  getLoanInstallments(loanId: string | number): Observable<Installment[]> {
    // TODO
    return this.http.get<Installment[]>(`${this.baseUrl}/${loanId}/installments`);
  }
}