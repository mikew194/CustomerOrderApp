import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common'; // For CommonModule
import { Subscription } from 'rxjs';

import CustomerService from '../customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-order',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  customer: Customer | null = null;
  estimatedCost: number | null = null;
  emailBody: string = '';
  emailOptions: string[] = ['Gmail', 'Outlook', 'Custom'];
  private customerSubscription!: Subscription;

  @ViewChild('targetButton') targetButtonRef!: ElementRef<HTMLButtonElement>;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService // Changed from private to public
  ) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      orderDate: [{ value: new Date().toLocaleDateString(), disabled: true }],
      estimatedSquareFeet: ['', [Validators.required, Validators.min(1)]],
      selectedEmail: ['', Validators.required]
    });

    this.customerSubscription = this.customerService.customer$.subscribe(customer => {
      this.customer = customer;
    });

    // Enable/disable 'Calculate Estimate' button based on form validity
    this.orderForm.valueChanges.subscribe(() => {
      this.estimatedCost = null; // Reset estimate if form changes
      this.emailBody = ''; // Reset email body
    });
  }

  ngOnDestroy(): void {
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
  }

  scrollToButton(): void {
    if (this.targetButtonRef) {
      this.targetButtonRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  calculateEstimate(): void {
    if (this.orderForm.valid) {
      const squareFeet = this.orderForm.get('estimatedSquareFeet')?.value;
      this.estimatedCost = squareFeet * 3.75;
      this.generateEmailBody();
      this.scrollToButton();
    }
  }

  generateEmailBody(): void {
    if (this.customer && this.estimatedCost !== null) {
      this.emailBody =
        `Dear ${this.customer.name}\n` +
        `Address: ${this.customer.address}\n` +
        `Phone: ${this.customer.phone}\n` +
        `Email: ${this.customer.email}\n\n` +
        `Thank you for your inquiry. Here are your order details:\n\n` +
        `Order Date: ${new Date().toLocaleDateString()}\n` +
        `Estimated Square Feet: ${this.orderForm.get('estimatedSquareFeet')?.value} sq ft\n` +
        `Estimated Cost: $${this.estimatedCost.toFixed(2)}\n\n` +
        `We will be in touch shortly to finalize the details.\n\n` +
        `Sincerely,\n` +
        `A-Stain Service Team\n` +
        `(504)418-7834`;
    }
  }

  sendNotification(): void {
    if (this.customer && this.emailBody && this.orderForm.get('selectedEmail')?.value) {
      const selectedEmailApp = this.orderForm.get('selectedEmail')?.value;
      let mailtoLink = '';
      const subject = encodeURIComponent('Your Service Estimate');
      const body = encodeURIComponent(this.emailBody);

      switch (selectedEmailApp) {
        case 'Gmail':
          mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.customer.email)}&su=${subject}&body=${body}`;
          break;
        case 'Outlook':
          mailtoLink = `mailto:${encodeURIComponent(this.customer.email)}?subject=${subject}&body=${body}`;
          break;
        case 'Custom':
          mailtoLink = `mailto:${encodeURIComponent(this.customer.email)}?subject=${subject}&body=${body}`;
          break;
      }

      window.open(mailtoLink, '_blank');
    }
  }
}