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
  private readonly baseUrl = `${environment.apiUrl}/order/orders`;

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
    let params = new HttpParams()
      .set('status', "ALL")

    return this.http.get<SecuritiesPage<Stock>>(`${this.baseUrl}`, { params });
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
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sort?.field || 'ticker')
      .set('sortDirection', sort?.direction || 'asc');

    return this.http.get<any>(`${environment.apiUrl}/stock/api/listings/futures`, { params }).pipe(
      map(response => ({
        ...response,
        content: response.content.map((item: any) => {
          // Handle zero/null prices
          const price = item.price || 1.0;
          const change = item.change || 0;
          const changePercent = price > 0 ? (change / price) * 100 : 0;
          
          return {
            id: item.listingId,
            ticker: item.ticker,
            name: item.name,
            exchange: item.exchangeMICCode,
            price: price,
            currency: 'USD',
            change: change,
            changePercent: changePercent,
            volume: item.volume || 0,
            maintenanceMargin: (item.initialMarginCost || 0) * 0.8,
            initialMarginCost: item.initialMarginCost || 0,
            type: 'FUTURE' as const,
            lastUpdated: new Date().toISOString(),
            settlementDate: item.settlementDate,
            contractSize: 1,
            openInterest: 0,
            high: price * 1.02,
            low: price * 0.98,
            open: price,
            previousClose: price - change,
            bid: price > 0 ? price - 0.01 : 0.99,
            ask: price > 0 ? price + 0.01 : 1.01,
          } as Future;
        })
      }))
    );
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
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sort?.field || 'ticker')
      .set('sortDirection', sort?.direction || 'asc');

    return this.http.get<any>(`${environment.apiUrl}/stock/api/listings/forex`, { params }).pipe(
      map(response => ({
        ...response,
        content: response.content.map((item: any) => {
          // Handle zero/null prices
          const price = item.price || 1.0;
          const change = item.change || 0;
          const changePercent = price > 0 ? (change / price) * 100 : 0;
          
          return {
            id: item.listingId,
            ticker: item.ticker,
            name: item.name,
            exchange: item.exchangeMICCode,
            price: price,
            currency: 'USD',
            change: change,
            changePercent: changePercent,
            volume: item.volume || 0,
            maintenanceMargin: (item.initialMarginCost || 0) * 0.8,
            initialMarginCost: item.initialMarginCost || 0,
            type: 'FOREX' as const,
            lastUpdated: new Date().toISOString(),
            baseCurrency: item.ticker.split('/')[0] || 'USD',
            quoteCurrency: item.ticker.split('/')[1] || 'USD',
            bid: price > 0 ? price - 0.0001 : 0.9999,
            ask: price > 0 ? price + 0.0001 : 1.0001,
            spread: 0.0002,
            high: price * 1.01,
            low: price * 0.99,
            open: price,
            previousClose: price - change,
          } as Forex;
        })
      }))
    );
  }

  /**
   * Get stock by ticker
   */
  getStockByTicker(ticker: string): Observable<Stock> {
    return this.getStocks({}, 0, 100).pipe(
      map(page => {
        const stock = page.content.find(s => s.ticker === ticker);
        if (!stock) throw new Error(`Stock ${ticker} not found`);
        return stock;
      })
    );
  }

  /**
   * Get future by id (listingId)
   */
  getFutureById(id: number): Observable<Future> {
    const params = new HttpParams().set('period', 'MONTH');
    return this.http.get<any>(`${environment.apiUrl}/stock/api/listings/${id}`, { params }).pipe(
      map((item: any) => {
        // Handle zero/null prices
        const price = item.price || 1.0;
        const change = item.change || 0;
        const changePercent = price > 0 ? (change / price) * 100 : 0;
        
        return {
          id: item.listingId,
          ticker: item.ticker,
          name: item.name,
          exchange: item.exchangeMICCode,
          price: price,
          currency: 'USD',
          change: change,
          changePercent: changePercent,
          volume: item.volume || 0,
          maintenanceMargin: (item.initialMarginCost || 0) * 0.8,
          initialMarginCost: item.initialMarginCost || 0,
          type: 'FUTURE' as const,
          lastUpdated: new Date().toISOString(),
          settlementDate: item.settlementDate,
          contractSize: 1,
          openInterest: 0,
          high: price * 1.02,
          low: price * 0.98,
          open: price,
          previousClose: price - change,
          bid: price > 0 ? price - 0.01 : 0.99,
          ask: price > 0 ? price + 0.01 : 1.01,
        } as Future;
      })
    );
  }

  /**
   * Get forex by id (listingId)
   */
  getForexById(id: number): Observable<Forex> {
    const params = new HttpParams().set('period', 'MONTH');
    return this.http.get<any>(`${environment.apiUrl}/stock/api/listings/${id}`, { params }).pipe(
      map((item: any) => {
        // Handle zero/null prices
        const price = item.price || 1.0;
        const change = item.change || 0;
        const changePercent = price > 0 ? (change / price) * 100 : 0;
        
        return {
          id: item.listingId,
          ticker: item.ticker,
          name: item.name,
          exchange: item.exchangeMICCode,
          price: price,
          currency: 'USD',
          change: change,
          changePercent: changePercent,
          volume: item.volume || 0,
          maintenanceMargin: (item.initialMarginCost || 0) * 0.8,
          initialMarginCost: item.initialMarginCost || 0,
          type: 'FOREX' as const,
          lastUpdated: new Date().toISOString(),
          baseCurrency: item.ticker.split('/')[0],
          quoteCurrency: item.ticker.split('/')[1],
          bid: price > 0 ? price - 0.0001 : 0.9999,
          ask: price > 0 ? price + 0.0001 : 1.0001,
          spread: 0.0002,
          high: price * 1.01,
          low: price * 0.99,
          open: price,
          previousClose: price - change,
        } as Forex;
      })
    );
  }

  /**
   * Get price history for a security
   */
  getPriceHistory(ticker: string, period: string): Observable<PriceHistory> {
    // Map period from component format to API format
    const periodMap: Record<string, string> = {
      'day': 'DAY',
      'week': 'WEEK',
      'month': 'MONTH',
      'year': 'YEAR',
      '5year': 'FIVE_YEARS',
      'all': 'ALL'
    };

    const apiPeriod = periodMap[period] || 'MONTH';

    // Extract listing id from ticker (ticker contains the id in this context)
    const listingId = ticker;

    const params = new HttpParams().set('period', apiPeriod);

    return this.http.get<any>(`${environment.apiUrl}/stock/api/listings/${listingId}`, { params }).pipe(
      map((response: any) => {
        // Map the response to PriceHistory format
        const priceData = response.priceHistory ? response.priceHistory.map((point: any) => ({
          date: point.date,
          price: point.price,
          volume: point.volume || 0
        })) : [];
        return {
          ticker: response.ticker || ticker,
          period: period,
          data: priceData
        } as PriceHistory;
      })
    );
  }

  /**
   * Get option chain for a stock from backend optionGroups
   * Note: ticker parameter is expected to be the stock id
   */
  getOptionChain(ticker: string, settlementDate: string): Observable<OptionChain> {
    const params = new HttpParams().set('period', 'DAY');
    
    return this.http.get<any>(`${environment.apiUrl}/stock/api/listings/${ticker}`, { params }).pipe(
      map((response: any) => {
        // Extract optionGroups and find matching settlement date
        const optionGroups = response.optionGroups || [];
        const matching = optionGroups.find((og: any) => og.settlementDate === settlementDate);
        
        if (!matching) {
          // Return empty option chain if settlement date not found
          return {
            settlementDate,
            daysToExpiry: 0,
            calls: [],
            puts: [],
            strikes: []
          } as OptionChain;
        }

        // Calculate days to expiry
        const expiry = new Date(settlementDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
          settlementDate: matching.settlementDate,
          daysToExpiry,
          calls: matching.options?.filter((opt: any) => opt.type === 'CALL') || [],
          puts: matching.options?.filter((opt: any) => opt.type === 'PUT') || [],
          strikes: [...new Set((matching.options || []).map((opt: any) => opt.strike))].sort((a: any, b: any) => a - b)
        } as OptionChain;
      })
    );
  }

  /**
   * Get available settlement dates for options from backend optionGroups
   * Note: ticker parameter is expected to be the stock id
   */
  getOptionSettlementDates(ticker: string): Observable<string[]> {
    const params = new HttpParams().set('period', 'DAY');
    
    return this.http.get<any>(`${environment.apiUrl}/stock/api/listings/${ticker}`, { params }).pipe(
      map((response: any) => {
        const optionGroups = response.optionGroups || [];
        const dates = optionGroups
          .map((og: any) => og.settlementDate)
          .filter((date: string | null) => date !== null && date !== undefined)
          .sort();
        return dates;
      })
    );
  }
}
