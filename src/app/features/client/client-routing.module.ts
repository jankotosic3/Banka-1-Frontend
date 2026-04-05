import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { NewPaymentComponent } from './components/new-payment/new-payment.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'accounts',
    component: AccountListComponent
  },
  {
    path: 'loans',
    component: LoanListComponent
  },
  { 
    path: 'loans/:id',
    component: LoanDetailsComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
