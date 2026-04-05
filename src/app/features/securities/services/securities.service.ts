import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Security,
  Stock,
  Future,
  Forex,
  SecuritiesFilters,
  SecuritiesPage,
  PriceHistory,
  PricePoint,
  OptionChain,
  StockOption,
  SortConfig,
} from '../models/security.model';

@Injectable({ providedIn: 'root' })
export class SecuritiesService {
  private readonly baseUrl = `${environment.apiUrl}/securities`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get list of stocks with filters and pagination
   */
  getStocks(
    filters: SecuritiesFilters = {},
    page = 0,
    size = 10,
    sort?: SortConfig
  ): Observable<SecuritiesPage<Stock>> {
    // TODO: Replace with real API call when backend is ready
    return this.getMockStocks(filters, page, size, sort);
  }

  /**
   * Get list of futures with filters and pagination
   */
  getFutures(
    filters: SecuritiesFilters = {},
    page = 0,
    size = 10,
    sort?: SortConfig
  ): Observable<SecuritiesPage<Future>> {
    // TODO: Replace with real API call when backend is ready
    return this.getMockFutures(filters, page, size, sort);
  }

  /**
   * Get list of forex pairs with filters and pagination
   */
  getForex(
    filters: SecuritiesFilters = {},
    page = 0,
    size = 10,
    sort?: SortConfig
  ): Observable<SecuritiesPage<Forex>> {
    // TODO: Replace with real API call when backend is ready
    return this.getMockForex(filters, page, size, sort);
  }

  /**
   * Get stock by ticker
   */
  getStockByTicker(ticker: string): Observable<Stock> {
    return this.getMockStocks({}, 0, 100).pipe(
      map(page => {
        const stock = page.content.find(s => s.ticker === ticker);
        if (!stock) throw new Error(`Stock ${ticker} not found`);
        return stock;
      })
    );
  }

  /**
   * Get future by ticker
   */
  getFutureByTicker(ticker: string): Observable<Future> {
    return this.getMockFutures({}, 0, 100).pipe(
      map(page => {
        const future = page.content.find(f => f.ticker === ticker);
        if (!future) throw new Error(`Future ${ticker} not found`);
        return future;
      })
    );
  }

  /**
   * Get forex by ticker
   */
  getForexByTicker(ticker: string): Observable<Forex> {
    return this.getMockForex({}, 0, 100).pipe(
      map(page => {
        const forex = page.content.find(f => f.ticker === ticker);
        if (!forex) throw new Error(`Forex ${ticker} not found`);
        return forex;
      })
    );
  }

  /**
   * Get price history for a security
   */
  getPriceHistory(ticker: string, period: string): Observable<PriceHistory> {
    return this.getMockPriceHistory(ticker, period);
  }

  /**
   * Get option chain for a stock
   */
  getOptionChain(ticker: string, settlementDate: string): Observable<OptionChain> {
    return this.getMockOptionChain(ticker, settlementDate);
  }

  /**
   * Get available settlement dates for options
   */
  getOptionSettlementDates(ticker: string): Observable<string[]> {
    return of([
      '2026-03-31',
      '2026-04-30',
      '2026-05-31',
      '2026-06-30',
      '2026-09-30',
      '2026-12-31',
    ]).pipe(delay(100));
  }

  // ─── Mock Data Methods ────────────────────────────────────────────────────

  private getMockStocks(
    filters: SecuritiesFilters,
    page: number,
    size: number,
    sort?: SortConfig
  ): Observable<SecuritiesPage<Stock>> {
    const allStocks: Stock[] = [
      {
        id: 1, ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', price: 245.67, currency: 'USD',
        change: 13.75, changePercent: 5.60, volume: 95234000, maintenanceMargin: 11166.82,
        initialMarginCost: 12283.50, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 248.50, low: 232.10, open: 233.00, previousClose: 231.92, bid: 245.65, ask: 245.69
      },
      {
        id: 2, ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NYSE', price: 178.25, currency: 'USD',
        change: 4.10, changePercent: 2.30, volume: 52341000, maintenanceMargin: 8102.27,
        initialMarginCost: 8912.50, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 180.50, low: 175.20, open: 176.00, previousClose: 174.15, bid: 178.23, ask: 178.27
      },
      {
        id: 3, ticker: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', price: 156.34, currency: 'USD',
        change: -0.78, changePercent: -0.50, volume: 38912000, maintenanceMargin: 7106.36,
        initialMarginCost: 7817.00, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 158.90, low: 154.50, open: 157.50, previousClose: 157.12, bid: 156.32, ask: 156.36
      },
      {
        id: 4, ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', price: 412.80, currency: 'EUR',
        change: -4.95, changePercent: -1.20, volume: 28934000, maintenanceMargin: 18763.64,
        initialMarginCost: 20640.00, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 420.00, low: 410.50, open: 418.00, previousClose: 417.75, bid: 412.78, ask: 412.82
      },
      {
        id: 5, ticker: 'SIE.DE', name: 'Siemens AG', exchange: 'FWB', price: 178.45, currency: 'EUR',
        change: 2.14, changePercent: 1.20, volume: 6789012, maintenanceMargin: 8111.36,
        initialMarginCost: 8922.50, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 180.20, low: 175.80, open: 176.50, previousClose: 176.31, bid: 178.43, ask: 178.47
      },
      {
        id: 6, ticker: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', price: 141.80, currency: 'USD',
        change: 1.42, changePercent: 1.01, volume: 23456000, maintenanceMargin: 6445.45,
        initialMarginCost: 7090.00, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 143.50, low: 139.80, open: 140.50, previousClose: 140.38, bid: 141.78, ask: 141.82
      },
      {
        id: 7, ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', price: 875.50, currency: 'USD',
        change: 25.65, changePercent: 3.02, volume: 45678000, maintenanceMargin: 39795.45,
        initialMarginCost: 43775.00, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 890.00, low: 850.00, open: 855.00, previousClose: 849.85, bid: 875.45, ask: 875.55
      },
      {
        id: 8, ticker: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', price: 485.30, currency: 'USD',
        change: -8.25, changePercent: -1.67, volume: 18234000, maintenanceMargin: 22059.09,
        initialMarginCost: 24265.00, type: 'STOCK', lastUpdated: new Date().toISOString(),
        high: 495.00, low: 482.00, open: 493.50, previousClose: 493.55, bid: 485.28, ask: 485.32
      },
    ];

    let filtered = this.applyFilters(allStocks, filters);

    // Apply bid/ask filters for stocks
    if (filters.bidMin !== undefined) {
      filtered = filtered.filter(s => s.bid >= filters.bidMin!);
    }
    if (filters.bidMax !== undefined) {
      filtered = filtered.filter(s => s.bid <= filters.bidMax!);
    }
    if (filters.askMin !== undefined) {
      filtered = filtered.filter(s => s.ask >= filters.askMin!);
    }
    if (filters.askMax !== undefined) {
      filtered = filtered.filter(s => s.ask <= filters.askMax!);
    }

    if (sort) {
      filtered = this.applySorting(filtered, sort);
    }

    return this.paginate(filtered, page, size);
  }

  private getMockFutures(
    filters: SecuritiesFilters,
    page: number,
    size: number,
    sort?: SortConfig
  ): Observable<SecuritiesPage<Future>> {
    const allFutures: Future[] = [
      {
        id: 101, ticker: 'ESM26', name: 'E-mini S&P 500 Jun 26', exchange: 'CME', price: 5245.50, currency: 'USD',
        change: 32.25, changePercent: 0.62, volume: 1234567, maintenanceMargin: 12500.00,
        initialMarginCost: 13750.00, type: 'FUTURE', lastUpdated: new Date().toISOString(),
        settlementDate: '2026-06-20', contractSize: 50, openInterest: 2345678,
        high: 5260.00, low: 5210.00, open: 5215.00, previousClose: 5213.25, bid: 5245.25, ask: 5245.75
      },
      {
        id: 102, ticker: 'CLM26', name: 'Crude Oil Jun 26', exchange: 'NYMEX', price: 78.45, currency: 'USD',
        change: -1.23, changePercent: -1.54, volume: 567890, maintenanceMargin: 6500.00,
        initialMarginCost: 7150.00, type: 'FUTURE', lastUpdated: new Date().toISOString(),
        settlementDate: '2026-06-20', contractSize: 1000, openInterest: 456789,
        high: 80.20, low: 77.80, open: 79.50, previousClose: 79.68, bid: 78.43, ask: 78.47
      },
      {
        id: 103, ticker: 'GCM26', name: 'Gold Jun 26', exchange: 'COMEX', price: 2045.30, currency: 'USD',
        change: 15.80, changePercent: 0.78, volume: 234567, maintenanceMargin: 9500.00,
        initialMarginCost: 10450.00, type: 'FUTURE', lastUpdated: new Date().toISOString(),
        settlementDate: '2026-06-26', contractSize: 100, openInterest: 345678,
        high: 2055.00, low: 2030.00, open: 2032.00, previousClose: 2029.50, bid: 2045.10, ask: 2045.50
      },
      {
        id: 104, ticker: 'NQM26', name: 'E-mini NASDAQ-100 Jun 26', exchange: 'CME', price: 18234.75, currency: 'USD',
        change: 125.50, changePercent: 0.69, volume: 456789, maintenanceMargin: 18500.00,
        initialMarginCost: 20350.00, type: 'FUTURE', lastUpdated: new Date().toISOString(),
        settlementDate: '2026-06-20', contractSize: 20, openInterest: 567890,
        high: 18350.00, low: 18100.00, open: 18120.00, previousClose: 18109.25, bid: 18234.50, ask: 18235.00
      },
      {
        id: 105, ticker: 'ZWN26', name: 'Wheat Jul 26', exchange: 'CBOT', price: 625.50, currency: 'USD',
        change: -8.25, changePercent: -1.30, volume: 123456, maintenanceMargin: 2200.00,
        initialMarginCost: 2420.00, type: 'FUTURE', lastUpdated: new Date().toISOString(),
        settlementDate: '2026-07-14', contractSize: 5000, openInterest: 234567,
        high: 635.00, low: 620.00, open: 633.00, previousClose: 633.75, bid: 625.25, ask: 625.75
      },
    ];

    let filtered = this.applyFilters(allFutures, filters);

    // Apply settlement date filter for futures
    if (filters.settlementDateFrom) {
      filtered = filtered.filter(f => f.settlementDate >= filters.settlementDateFrom!);
    }
    if (filters.settlementDateTo) {
      filtered = filtered.filter(f => f.settlementDate <= filters.settlementDateTo!);
    }

    // Apply bid/ask filters for futures
    if (filters.bidMin !== undefined) {
      filtered = filtered.filter(f => f.bid >= filters.bidMin!);
    }
    if (filters.bidMax !== undefined) {
      filtered = filtered.filter(f => f.bid <= filters.bidMax!);
    }
    if (filters.askMin !== undefined) {
      filtered = filtered.filter(f => f.ask >= filters.askMin!);
    }
    if (filters.askMax !== undefined) {
      filtered = filtered.filter(f => f.ask <= filters.askMax!);
    }

    if (sort) {
      filtered = this.applySorting(filtered, sort);
    }

    return this.paginate(filtered, page, size);
  }

  private getMockForex(
    filters: SecuritiesFilters,
    page: number,
    size: number,
    sort?: SortConfig
  ): Observable<SecuritiesPage<Forex>> {
    const allForex: Forex[] = [
      {
        id: 201, ticker: 'EUR/USD', name: 'Euro / US Dollar', exchange: 'FOREX', price: 1.0845, currency: 'USD',
        change: 0.0023, changePercent: 0.21, volume: 125000000, maintenanceMargin: 2500.00,
        initialMarginCost: 2750.00, type: 'FOREX', lastUpdated: new Date().toISOString(),
        baseCurrency: 'EUR', quoteCurrency: 'USD', bid: 1.0843, ask: 1.0847, spread: 0.0004,
        high: 1.0880, low: 1.0810, open: 1.0825, previousClose: 1.0822
      },
      {
        id: 202, ticker: 'GBP/USD', name: 'British Pound / US Dollar', exchange: 'FOREX', price: 1.2650, currency: 'USD',
        change: -0.0045, changePercent: -0.35, volume: 89000000, maintenanceMargin: 3200.00,
        initialMarginCost: 3520.00, type: 'FOREX', lastUpdated: new Date().toISOString(),
        baseCurrency: 'GBP', quoteCurrency: 'USD', bid: 1.2648, ask: 1.2652, spread: 0.0004,
        high: 1.2720, low: 1.2630, open: 1.2695, previousClose: 1.2695
      },
      {
        id: 203, ticker: 'USD/JPY', name: 'US Dollar / Japanese Yen', exchange: 'FOREX', price: 151.25, currency: 'JPY',
        change: 0.85, changePercent: 0.56, volume: 98000000, maintenanceMargin: 2800.00,
        initialMarginCost: 3080.00, type: 'FOREX', lastUpdated: new Date().toISOString(),
        baseCurrency: 'USD', quoteCurrency: 'JPY', bid: 151.23, ask: 151.27, spread: 0.04,
        high: 151.80, low: 150.20, open: 150.50, previousClose: 150.40
      },
      {
        id: 204, ticker: 'USD/CHF', name: 'US Dollar / Swiss Franc', exchange: 'FOREX', price: 0.8945, currency: 'CHF',
        change: 0.0012, changePercent: 0.13, volume: 45000000, maintenanceMargin: 2600.00,
        initialMarginCost: 2860.00, type: 'FOREX', lastUpdated: new Date().toISOString(),
        baseCurrency: 'USD', quoteCurrency: 'CHF', bid: 0.8943, ask: 0.8947, spread: 0.0004,
        high: 0.8980, low: 0.8920, open: 0.8935, previousClose: 0.8933
      },
      {
        id: 205, ticker: 'AUD/USD', name: 'Australian Dollar / US Dollar', exchange: 'FOREX', price: 0.6525, currency: 'USD',
        change: -0.0018, changePercent: -0.28, volume: 56000000, maintenanceMargin: 2100.00,
        initialMarginCost: 2310.00, type: 'FOREX', lastUpdated: new Date().toISOString(),
        baseCurrency: 'AUD', quoteCurrency: 'USD', bid: 0.6523, ask: 0.6527, spread: 0.0004,
        high: 0.6560, low: 0.6510, open: 0.6545, previousClose: 0.6543
      },
    ];

    let filtered = this.applyFilters(allForex, filters);

    // Apply bid/ask filters for forex
    if (filters.bidMin !== undefined) {
      filtered = filtered.filter(f => f.bid >= filters.bidMin!);
    }
    if (filters.bidMax !== undefined) {
      filtered = filtered.filter(f => f.bid <= filters.bidMax!);
    }
    if (filters.askMin !== undefined) {
      filtered = filtered.filter(f => f.ask >= filters.askMin!);
    }
    if (filters.askMax !== undefined) {
      filtered = filtered.filter(f => f.ask <= filters.askMax!);
    }

    if (sort) {
      filtered = this.applySorting(filtered, sort);
    }

    return this.paginate(filtered, page, size);
  }

  private getMockPriceHistory(ticker: string, period: string): Observable<PriceHistory> {
    const now = new Date();
    const data: PricePoint[] = [];
    let days: number;

    switch (period) {
      case 'day': days = 1; break;
      case 'week': days = 7; break;
      case 'month': days = 30; break;
      case 'year': days = 365; break;
      case '5year': days = 1825; break;
      default: days = 2500; // from start
    }

    const basePrice = 100;
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const randomChange = (Math.random() - 0.48) * 5;
      const price = basePrice + (days - i) * 0.1 + randomChange;
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(10, price),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      });
    }

    return of({ ticker, period, data }).pipe(delay(200));
  }

  private getMockOptionChain(ticker: string, settlementDate: string): Observable<OptionChain> {
    const currentPrice = 178.25; // AAPL example
    const strikes = [165, 170, 175, 180, 185, 190, 195, 200];

    const expiry = new Date(settlementDate);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const calls: StockOption[] = strikes.map(strike => ({
      strike,
      type: 'CALL' as const,
      last: Math.max(0.01, currentPrice - strike + (Math.random() * 5)),
      theta: -(Math.random() * 0.15 + 0.01),
      bid: Math.max(0.01, currentPrice - strike + (Math.random() * 4)),
      ask: Math.max(0.02, currentPrice - strike + (Math.random() * 6)),
      volume: Math.floor(Math.random() * 5000) + 100,
      openInterest: Math.floor(Math.random() * 10000) + 500,
      inTheMoney: strike < currentPrice,
    }));

    const puts: StockOption[] = strikes.map(strike => ({
      strike,
      type: 'PUT' as const,
      last: Math.max(0.01, strike - currentPrice + (Math.random() * 5)),
      theta: -(Math.random() * 0.15 + 0.01),
      bid: Math.max(0.01, strike - currentPrice + (Math.random() * 4)),
      ask: Math.max(0.02, strike - currentPrice + (Math.random() * 6)),
      volume: Math.floor(Math.random() * 5000) + 100,
      openInterest: Math.floor(Math.random() * 10000) + 500,
      inTheMoney: strike > currentPrice,
    }));

    return of({
      settlementDate,
      daysToExpiry,
      calls,
      puts,
      strikes,
    }).pipe(delay(200));
  }

  // ─── Helper Methods ────────────────────────────────────────────────────────

  private applyFilters<T extends Security>(items: T[], filters: SecuritiesFilters): T[] {
    let result = [...items];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(item =>
        item.ticker.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search)
      );
    }

    if (filters.exchange) {
      result = result.filter(item =>
        item.exchange.toLowerCase().includes(filters.exchange!.toLowerCase())
      );
    }

    if (filters.priceMin !== undefined) {
      result = result.filter(item => item.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      result = result.filter(item => item.price <= filters.priceMax!);
    }

    if (filters.volumeMin !== undefined) {
      result = result.filter(item => item.volume >= filters.volumeMin!);
    }
    if (filters.volumeMax !== undefined) {
      result = result.filter(item => item.volume <= filters.volumeMax!);
    }

    if (filters.marginMin !== undefined) {
      result = result.filter(item => item.maintenanceMargin >= filters.marginMin!);
    }
    if (filters.marginMax !== undefined) {
      result = result.filter(item => item.maintenanceMargin <= filters.marginMax!);
    }

    return result;
  }

  private applySorting<T extends Security>(items: T[], sort: SortConfig): T[] {
    return [...items].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sort.field) {
        case 'price': aVal = a.price; bVal = b.price; break;
        case 'volume': aVal = a.volume; bVal = b.volume; break;
        case 'change': aVal = a.changePercent; bVal = b.changePercent; break;
        case 'margin': aVal = a.maintenanceMargin; bVal = b.maintenanceMargin; break;
        case 'ticker': aVal = a.ticker; bVal = b.ticker; break;
        case 'name': aVal = a.name; bVal = b.name; break;
        default: return 0;
      }

      if (typeof aVal === 'string') {
        const comparison = aVal.localeCompare(bVal as string);
        return sort.direction === 'asc' ? comparison : -comparison;
      }

      return sort.direction === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });
  }

  private paginate<T>(items: T[], page: number, size: number): Observable<SecuritiesPage<T>> {
    const totalElements = items.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = items.slice(start, start + size);

    return of({
      content,
      totalElements,
      totalPages,
      number: page,
      size,
    }).pipe(delay(300));
  }
}
