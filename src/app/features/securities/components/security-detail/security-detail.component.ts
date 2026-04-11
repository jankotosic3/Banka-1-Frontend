import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { SecuritiesService } from '../../services/securities.service';
import {
  Security,
  Future,
  Forex,
  PriceHistory,
} from '../../models/security.model';

type Period = 'day' | 'week' | 'month' | 'year' | '5year' | 'all';

interface DetailRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-security-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './security-detail.component.html',
  styleUrls: ['./security-detail.component.scss'],
})
export class SecurityDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly destroy$ = new Subject<void>();

  securityType: 'future' | 'forex' = 'future';
  id: number | null = null;

  security: Security | null = null;
  priceHistory: PriceHistory | null = null;
  isLoading = true;
  errorMessage = '';

  selectedPeriod: Period = 'month';

  periods: { value: Period; label: string }[] = [
    { value: 'day', label: 'Dan' },
    { value: 'week', label: 'Nedelja' },
    { value: 'month', label: 'Mesec' },
    { value: 'year', label: 'Godina' },
    { value: '5year', label: '5 God' },
    { value: 'all', label: 'Početak' },
  ];

  detailRows: DetailRow[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly securitiesService: SecuritiesService
  ) {}

  ngOnInit(): void {
    this.securityType = this.route.snapshot.data['securityType'];
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      // Route still uses 'ticker' parameter name, but it now contains the id value
      this.id = params['ticker'] ? parseInt(params['ticker'], 10) : null;
      this.loadSecurity();
    });
  }

  ngAfterViewInit(): void {
    // Chart will be drawn after data is loaded
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSecurity(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.id) {
      this.errorMessage = 'Greška pri učitavanju hartije od vrednosti.';
      this.isLoading = false;
      return;
    }

    const request$: Observable<Security> =
      this.securityType === 'future'
        ? this.securitiesService.getFutureById(this.id)
        : this.securitiesService.getForexById(this.id);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (security: Security) => {
        this.security = security;
        this.buildDetailRows();
        this.loadPriceHistory();
      },
      error: (err: Error) => {
        this.errorMessage = 'Greška pri učitavanju hartije od vrednosti.';
        this.isLoading = false;
      },
    });
  }

  loadPriceHistory(): void {
    if (!this.security || !this.id) return;
    
    this.securitiesService
      .getPriceHistory(this.id.toString(), this.selectedPeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (history) => {
          // If no historical data, use current price as fallback
          if (!history.data || history.data.length === 0) {
            history.data = [{
              date: new Date().toISOString(),
              price: this.security!.price,
              volume: this.security!.volume || 0
            }];
          }
          
          this.priceHistory = history;
          this.isLoading = false;
          setTimeout(() => this.drawChart(), 0);
        },
        error: (err) => {
          console.error('Error loading price history:', err);
          this.isLoading = false;
        },
      });
  }

  selectPeriod(period: Period): void {
    this.selectedPeriod = period;
    this.loadPriceHistory();
  }

  buildDetailRows(): void {
    if (!this.security) return;

    if (this.securityType === 'future') {
      const future = this.security as Future;
      this.detailRows = [
        { label: 'Otvaranje', value: this.formatPrice(future.open) },
        { label: 'Najviša', value: this.formatPrice(future.high) },
        { label: 'Najniža', value: this.formatPrice(future.low) },
        { label: 'Prethodno zatvaranje', value: this.formatPrice(future.previousClose) },
        { label: 'Datum izmirenja', value: future.settlementDate },
        { label: 'Veličina ugovora', value: future.contractSize.toString() },
        { label: 'Otvoreni interes', value: this.formatVolume(future.openInterest) },
      ];
    } else {
      const forex = this.security as Forex;
      this.detailRows = [
        { label: 'Otvaranje', value: this.formatPrice(forex.open) },
        { label: 'Najviša', value: this.formatPrice(forex.high) },
        { label: 'Najniža', value: this.formatPrice(forex.low) },
        { label: 'Prethodno zatvaranje', value: this.formatPrice(forex.previousClose) },
        { label: 'Bid', value: forex.bid.toFixed(4) },
        { label: 'Ask', value: forex.ask.toFixed(4) },
        { label: 'Spread', value: forex.spread.toFixed(4) },
      ];
    }
  }

  drawChart(): void {
    if (!this.chartCanvas || !this.priceHistory?.data?.length) return;

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = this.priceHistory.data;
    const padding = 40;
    const width = rect.width;
    const height = rect.height;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min/max prices
    const prices = data.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    let priceRange = maxPrice - minPrice;
    
    // If there's only one data point, add some padding to show it in the middle
    if (priceRange === 0) {
      priceRange = Math.abs(minPrice) * 0.2 || 1;
    }
    
    const displayMin = minPrice - priceRange * 0.1;
    const displayRange = priceRange * 1.2;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Price labels
      const price = (minPrice + displayRange) - (displayRange / 4) * i;
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(price.toFixed(2), padding - 5, y + 4);
    }

    // Draw line chart
    ctx.beginPath();
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    data.forEach((point, index) => {
      const xPos = data.length > 1 
        ? padding + (chartWidth / (data.length - 1)) * index
        : padding + chartWidth / 2;
      const y = padding + chartHeight - ((point.price - displayMin) / displayRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(xPos, y);
      } else {
        ctx.lineTo(xPos, y);
      }
    });

    ctx.stroke();

    // Draw data point markers
    ctx.fillStyle = '#16a34a';
    data.forEach((point, index) => {
      const xPos = data.length > 1 
        ? padding + (chartWidth / (data.length - 1)) * index
        : padding + chartWidth / 2;
      const y = padding + chartHeight - ((point.price - displayMin) / displayRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(xPos, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Fill area under line
    const lastX = data.length > 1 
      ? padding + chartWidth
      : padding + chartWidth / 2;
    const lastY = padding + chartHeight - ((data[data.length - 1].price - displayMin) / displayRange) * chartHeight;

    ctx.lineTo(lastX, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(22, 163, 74, 0.3)');
    gradient.addColorStop(1, 'rgba(22, 163, 74, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw date labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';

    const labelCount = Math.min(5, data.length);
    for (let i = 0; i < labelCount; i++) {
      const dataIndex = labelCount > 1
        ? Math.floor((i / (labelCount - 1)) * (data.length - 1))
        : 0;
      const x = data.length > 1
        ? padding + (chartWidth / (data.length - 1)) * dataIndex
        : padding + chartWidth / 2;
      const date = new Date(data[dataIndex].date);
      const label = date.toLocaleDateString('sr-RS', { month: 'short', year: '2-digit' });
      ctx.fillText(label, x, height - padding + 15);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  formatVolume(volume: number): string {
    return new Intl.NumberFormat('sr-RS').format(volume);
  }

  formatChange(change: number, changePercent: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  }

  getChangeClass(change: number): string {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  }

  goBack(): void {
    this.router.navigate(['/securities']);
  }
}
