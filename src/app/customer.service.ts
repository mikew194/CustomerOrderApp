import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from './models/customer.model';

@Injectable({
  providedIn: 'root'
})
export default class CustomerService {
  private customerSubject = new BehaviorSubject<Customer | null>(null);

  public customer$: Observable<Customer | null> = this.customerSubject.asObservable();

  constructor() { }

  setCustomer(customer: Customer): void {
    this.customerSubject.next(customer);
  }

  getCustomer(): Customer | null {
    return this.customerSubject.getValue();
  }
};