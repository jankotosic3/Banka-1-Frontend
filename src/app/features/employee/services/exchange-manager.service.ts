import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { ExchangeService } from './exchange.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http'; 

export interface ExchangeInfo {
  id: number;
  exchangeName: string;
  exchangeAcronym: string;
  exchangeMICCode: string;
  polity: string;
  currency: string;
  timeZone: string;
  openTime: string;
  closeTime: string;
  preMarketOpenTime: string | null;
  preMarketCloseTime: string | null;
  postMarketOpenTime: string | null;
  postMarketCloseTime: string | null;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeManagerService {
  
  private availableExchangesSubject = new BehaviorSubject<ExchangeInfo[]>([]);
  public availableExchanges$ = this.availableExchangesSubject.asObservable();

  private useMockDataSubject = new BehaviorSubject<boolean>(false);
  public useMockData$ = this.useMockDataSubject.asObservable();

  private loadErrorSubject = new BehaviorSubject<boolean>(false);
  public loadError$ = this.loadErrorSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private exchangeService: ExchangeService
  ) {
    this.loadExchanges(); 
  }

  /**
   * Učitava berze sa API-ja
   */
  loadExchanges(): void {
    console.log('loadExchanges() pozvan');
    this.exchangeService.getExchanges().pipe(
      tap(exchanges => {
        console.log('Berze učitane:', exchanges);
        this.availableExchangesSubject.next(exchanges);
        this.loadErrorSubject.next(false);
      }),
      shareReplay(1)
    ).subscribe({
      error: (err) => {
        console.error('Greška pri učitavanju berzi:', err);
        this.availableExchangesSubject.next([]);
        this.loadErrorSubject.next(true);
      }
    });
  }

  /**
   * Prebacuje između mock i stvarnih podataka
   */
  toggleMockData(): void {
    this.useMockDataSubject.next(!this.useMockDataSubject.value);
    this.loadExchanges();
  }

  /**
   * Postavlja korišćenje mock podataka
   */
  setUseMockData(useMock: boolean): void {
    if (this.useMockDataSubject.value !== useMock) {
      this.useMockDataSubject.next(useMock);
      this.loadExchanges();
    }
  }

  /**
   * Vraća dostupne MIC kodove berzi
   */
  getAvailableExchangeCodes(): string[] {
    return this.availableExchangesSubject.value.map(ex => ex.exchangeMICCode);
  }

  /**
   * Proverava da li je berza dostupna
   */
  isExchangeAvailable(exchangeMICCode: string | undefined | null): boolean {
    if (!exchangeMICCode) {
      return false;
    }
    return this.getAvailableExchangeCodes().includes(exchangeMICCode);
  }

  /**
   * Vraća informacije o berzi po MIC kodu
   */
  getExchangeInfo(exchangeMICCode: string): ExchangeInfo | undefined {
    return this.availableExchangesSubject.value.find(ex => ex.exchangeMICCode === exchangeMICCode);
  }

  /**
   * Vraća trenutne berze kao Observable
   */
  getExchanges(): Observable<ExchangeInfo[]> {
    return this.availableExchanges$;
  }

  toggleExchangeActive(id: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/stock/api/stock-exchanges/${id}/toggle-active`, {});
  }

  /**
   * Proverava da li je berza otvorena na osnovu trenutnog vremena u njenoj vremenskoj zoni
   */
  isExchangeOpen(exchange: ExchangeInfo): boolean {
    try {
      // Dobij trenutno vreme u vremenskoj zoni berze
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: exchange.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const parts = formatter.formatToParts(now);
      const hour = parts.find(p => p.type === 'hour')?.value || '00';
      const minute = parts.find(p => p.type === 'minute')?.value || '00';
      const second = parts.find(p => p.type === 'second')?.value || '00';
      
      const currentTimeStr = `${hour}:${minute}:${second}`;
      
      // Pretvori u vremenske vrednosti za poređenje (HH:MM:SS)
      const currentTime = currentTimeStr;
      const openTime = exchange.openTime || '00:00:00';
      const closeTime = exchange.closeTime || '23:59:59';
      
      // Poredi vremenske stringove (rade jer su u formatu HH:MM:SS)
      return currentTime >= openTime && currentTime < closeTime;
    } catch (error) {
      console.error('Greška pri proveravanju vremena berze:', error);
      return false;
    }
  }

  /**
   * Vraća trenutni status mock podataka
   */
  get isMockEnabled(): boolean {
    return this.useMockDataSubject.value;
  }
}