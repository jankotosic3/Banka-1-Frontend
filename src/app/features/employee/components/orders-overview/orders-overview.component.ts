import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../shared/services/toast.service';

type OrderStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'DONE';
type OrderDirection = 'BUY' | 'SELL';
type OrderFilter = 'ALL' | OrderStatus;

interface TradingOrder {
  id: number;
  agent: string;
  orderType: string;
  assetType: string;
  quantity: number;
  contractSize: number;
  pricePerUnit: number;
  direction: OrderDirection;
  remainingPortions: number;
  status: OrderStatus;
  isDone: boolean;
  settlementDate?: string;
}

@Component({
  selector: 'app-orders-overview',
  templateUrl: './orders-overview.component.html',
  styleUrls: ['./orders-overview.component.css'],
})
export class OrdersOverviewComponent implements OnInit {
  orders: TradingOrder[] = [];
  selectedFilter: OrderFilter = 'ALL';
  filters: OrderFilter[] = ['ALL', 'PENDING', 'APPROVED', 'DECLINED', 'DONE'];
  isLoading = false;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  get filteredOrders(): TradingOrder[] {
    if (this.selectedFilter === 'ALL') {
      return this.orders;
    }

    return this.orders.filter((order) => order.status === this.selectedFilter);
  }

  loadOrders(): void {
    this.orders = [];
    this.isLoading = false;
  }

  setFilter(filter: OrderFilter): void {
    this.selectedFilter = filter;
  }

  approveOrder(order: TradingOrder): void {
    this.toastService.success(`Approve action selected for order ${order.id}.`);
  }

  declineOrder(order: TradingOrder): void {
    this.toastService.success(`Decline action selected for order ${order.id}.`);
  }

  cancelOrder(order: TradingOrder): void {
    this.toastService.success(`Cancel action selected for order ${order.id}.`);
  }

  isExpired(order: TradingOrder): boolean {
    if (!order.settlementDate) return false;
    return new Date(order.settlementDate).getTime() < Date.now();
  }

  canApprove(order: TradingOrder): boolean {
    return order.status === 'PENDING' && !this.isExpired(order);
  }

  canDecline(order: TradingOrder): boolean {
    return order.status === 'PENDING';
  }

  canCancel(order: TradingOrder): boolean {
    return (
      order.status === 'APPROVED' &&
      !order.isDone &&
      order.remainingPortions > 0
    );
  }

  trackById(index: number, order: TradingOrder): number {
    return order.id || index;
  }
}
