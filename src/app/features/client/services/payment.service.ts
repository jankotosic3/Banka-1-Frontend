import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Payment, PaymentPage, PaymentFilters, PaymentStatus } from '../models/payment.model';

/**
 * Servis za upravljanje plaćanjima
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Dohvata listu plaćanja sa filterima i paginacijom
   * @param filters Filteri za pretragu
   * @param page Broj stranice (počinje od 0)
   * @param size Broj elemenata po stranici
   * @returns Observable sa paginiranom listom plaćanja
   */
  getPayments(
    filters: PaymentFilters = {},
    page = 0,
    size = 10
  ): Observable<PaymentPage> {
    // TODO: Kada backend bude spreman, ukloniti mock podatke
    // i koristiti pravi API poziv ispod

    // let params = new HttpParams()
    //   .set('page', page.toString())
    //   .set('size', size.toString());
    //
    // if (filters.dateFrom) {
    //   params = params.set('dateFrom', filters.dateFrom);
    // }
    // if (filters.dateTo) {
    //   params = params.set('dateTo', filters.dateTo);
    // }
    // if (filters.amountFrom !== undefined) {
    //   params = params.set('amountFrom', filters.amountFrom.toString());
    // }
    // if (filters.amountTo !== undefined) {
    //   params = params.set('amountTo', filters.amountTo.toString());
    // }
    // if (filters.status) {
    //   params = params.set('status', filters.status);
    // }
    //
    // return this.http.get<PaymentPage>(this.baseUrl, { params });

    // Mock podaci za razvoj
    return this.getMockPayments(filters, page, size);
  }

  /**
   * Mock podaci za razvoj dok backend nije spreman
   */
  private getMockPayments(
    filters: PaymentFilters,
    page: number,
    size: number
  ): Observable<PaymentPage> {
    const allPayments: Payment[] = [
      {
        id: 1,
        date: '2026-03-03',
        payerName: 'Interni prenos',
        currency: 'RSD',
        amount: 3000.00,
        status: 'REALIZED',
        payerAccountNumber: '265-0000000012345-89',
        recipientAccountNumber: '265-0000000054321-12',
        purpose: 'Prenos sredstava'
      },
      {
        id: 2,
        date: '2026-03-01',
        payerName: 'Maja Nikolić',
        currency: 'RSD',
        amount: -2000.00,
        status: 'REJECTED',
        payerAccountNumber: '265-0000000012345-89',
        recipientAccountNumber: '170-0000000098765-43',
        purpose: 'Uplata za usluge'
      },
      {
        id: 3,
        date: '2026-03-01',
        payerName: 'Mama',
        currency: 'RSD',
        amount: 2787.00,
        status: 'PROCESSING',
        payerAccountNumber: '160-0000000111222-33',
        recipientAccountNumber: '265-0000000012345-89',
        purpose: 'Poklon'
      },
      {
        id: 4,
        date: '2026-02-28',
        payerName: 'Interni prenos',
        currency: 'RSD',
        amount: 50000.00,
        status: 'PROCESSING',
        payerAccountNumber: '265-0000000012345-89',
        recipientAccountNumber: '265-0000000054321-12',
        purpose: 'Prenos na štednju'
      },
      {
        id: 5,
        date: '2026-02-25',
        payerName: 'Petar Petrović',
        currency: 'RSD',
        amount: 15000.00,
        status: 'REALIZED',
        payerAccountNumber: '205-0000000333444-55',
        recipientAccountNumber: '265-0000000012345-89',
        purpose: 'Vraćanje duga'
      },
      {
        id: 6,
        date: '2026-02-20',
        payerName: 'EPS Srbija',
        currency: 'RSD',
        amount: -4500.00,
        status: 'REALIZED',
        payerAccountNumber: '265-0000000012345-89',
        recipientAccountNumber: '840-0000000000001-23',
        purpose: 'Račun za struju - februar 2026',
        paymentCode: '289'
      },
      {
        id: 7,
        date: '2026-02-15',
        payerName: 'Telenor Srbija',
        currency: 'RSD',
        amount: -2199.00,
        status: 'REALIZED',
        payerAccountNumber: '265-0000000012345-89',
        recipientAccountNumber: '160-0000000555666-77',
        purpose: 'Telefonski račun',
        paymentCode: '289'
      },
      {
        id: 8,
        date: '2026-02-10',
        payerName: 'Marko Marković',
        currency: 'RSD',
        amount: -8000.00,
        status: 'REJECTED',
        payerAccountNumber: '265-0000000012345-89',
        recipientAccountNumber: '325-0000000777888-99',
        purpose: 'Pozajmica'
      },
      {
        id: 9,
        date: '2026-02-05',
        payerName: 'Poslodavac DOO',
        currency: 'RSD',
        amount: 95000.00,
        status: 'REALIZED',
        payerAccountNumber: '170-0000000123456-78',
        recipientAccountNumber: '265-0000000012345-89',
        purpose: 'Plata - januar 2026'
      },
      {
        id: 10,
        date: '2026-01-28',
        payerName: 'Interni prenos',
        currency: 'RSD',
        amount: 10000.00,
        status: 'REALIZED',
        payerAccountNumber: '265-0000000054321-12',
        recipientAccountNumber: '265-0000000012345-89',
        purpose: 'Podizanje sa štednje'
      }
    ];

    // Primena filtera
    let filtered = [...allPayments];

    if (filters.dateFrom) {
      filtered = filtered.filter(p => p.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(p => p.date <= filters.dateTo!);
    }
    if (filters.amountFrom !== undefined && filters.amountFrom !== null) {
      filtered = filtered.filter(p => Math.abs(p.amount) >= filters.amountFrom!);
    }
    if (filters.amountTo !== undefined && filters.amountTo !== null) {
      filtered = filtered.filter(p => Math.abs(p.amount) <= filters.amountTo!);
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Sortiranje po datumu (najnovije prvo)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Paginacija
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = filtered.slice(start, start + size);

    const response: PaymentPage = {
      content,
      totalElements,
      totalPages,
      number: page,
      size
    };

    // Simulacija kašnjenja mreže
    return of(response).pipe(delay(300));
  }

  /**
   * Dohvata detalje pojedinačnog plaćanja
   * @param id ID plaćanja
   * @returns Observable sa detaljima plaćanja
   */
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }
}
