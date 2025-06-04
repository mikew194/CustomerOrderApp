
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common'; // For CommonModule

import CustomerService from '../customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ]
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Basic 10-digit phone validation
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      this.customerService.setCustomer(customer);
      this.router.navigate(['/order']);
    }
  }
}