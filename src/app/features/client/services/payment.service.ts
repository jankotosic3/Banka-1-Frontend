import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { Payment, PaymentPage, PaymentFilters } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.apiUrl}/payments`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Dohvata listu plaćanja sa filterima i paginacijom.
   */
  public getPayments(
    filters: PaymentFilters = {},
    page = 0,
    size = 10
  ): Observable<PaymentPage> {    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo);
    }
    if (filters.amountFrom !== undefined) {
      params = params.set('amountFrom', filters.amountFrom.toString());
    }
    if (filters.amountTo !== undefined) {
      params = params.set('amountTo', filters.amountTo.toString());
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    
    return this.http.get<PaymentPage>(this.baseUrl, { params });
  }

  public getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }
}
