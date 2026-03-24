import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { PaymentService } from '../../services/payment.service';
import { Payment, PaymentFilters, PaymentStatus } from '../../models/payment.model';

/**
 * Komponenta za pregled plaćanja (Payment History)
 * Prikazuje listu svih transakcija sa filterima i paginacijom
 */
@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private filterChange$ = new Subject<void>();

  // Podaci
  payments: Payment[] = [];
  isLoading = false;
  errorMessage = '';

  // Paginacija
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filteri
  filters: PaymentFilters = {
    dateFrom: '',
    dateTo: '',
    amountFrom: undefined,
    amountTo: undefined,
    status: ''
  };

  // Opcije za filter period
  selectedPeriod = '7';
  periodOptions = [
    { value: '7', label: 'Prethodnih 7 dana' },
    { value: '30', label: 'Prethodnih 30 dana' },
    { value: '90', label: 'Prethodna 3 meseca' },
    { value: 'all', label: 'Sve' }
  ];

  // Aktivni tab
  activeTab: 'domestic' | 'transfers' = 'domestic';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    // Debounce za filtere
    this.filterChange$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadPayments();
      });

    this.loadPayments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Učitavanje plaćanja sa servera
   */
  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService
      .getPayments(this.filters, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          this.payments = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Greška pri učitavanju plaćanja:', err);
          this.errorMessage = 'Došlo je do greške pri učitavanju plaćanja.';
          this.isLoading = false;
        }
      });
  }

  /**
   * Handler za promenu filtera
   */
  onFiltersChange(): void {
    this.filterChange$.next();
  }

  /**
   * Promena perioda iz dropdown-a
   */
  onPeriodChange(): void {
    const today = new Date();
    let dateFrom: Date | null = null;

    switch (this.selectedPeriod) {
      case '7':
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - 7);
        break;
      case '30':
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - 30);
        break;
      case '90':
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - 90);
        break;
      case 'all':
        dateFrom = null;
        break;
    }

    this.filters.dateFrom = dateFrom ? this.formatDateForInput(dateFrom) : '';
    this.filters.dateTo = '';
    this.onFiltersChange();
  }

  /**
   * Resetovanje svih filtera
   */
  clearFilters(): void {
    this.filters = {
      dateFrom: '',
      dateTo: '',
      amountFrom: undefined,
      amountTo: undefined,
      status: ''
    };
    this.selectedPeriod = '7';
    this.currentPage = 0;
    this.loadPayments();
  }

  /**
   * Promena stranice
   */
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPayments();
    }
  }

  /**
   * Promena taba
   */
  setActiveTab(tab: 'domestic' | 'transfers'): void {
    this.activeTab = tab;
    // TODO: Filtriranje po tipu transakcije kada backend podrži
  }

  /**
   * Formatiranje datuma za prikaz
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Formatiranje datuma za input polje
   */
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Formatiranje iznosa
   */
  formatAmount(amount: number): string {
    const prefix = amount >= 0 ? '+' : '';
    return prefix + new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Vraća CSS klasu za status
   */
  getStatusClass(status: PaymentStatus): string {
    switch (status) {
      case 'REALIZED':
        return 'status--realized';
      case 'PROCESSING':
        return 'status--processing';
      case 'REJECTED':
        return 'status--rejected';
      default:
        return '';
    }
  }

  /**
   * Vraća label za status
   */
  getStatusLabel(status: PaymentStatus): string {
    switch (status) {
      case 'REALIZED':
        return 'ODOBRENO';
      case 'PROCESSING':
        return 'ČEKANJE';
      case 'REJECTED':
        return 'ODBIJENO';
      default:
        return status;
    }
  }

  /**
   * Vraća poslednji item za paginaciju
   */
  getLastItem(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  /**
   * TrackBy funkcija za ngFor
   */
  trackByPaymentId(index: number, payment: Payment): number {
    return payment.id;
  }
}
