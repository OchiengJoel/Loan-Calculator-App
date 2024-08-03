import { Component } from '@angular/core';

@Component({
  selector: 'app-car-loan',
  templateUrl: './car-loan.component.html',
  styleUrls: ['./car-loan.component.css']
})
export class CarLoanComponent {

  principal!: number;
  annualRate!: number;
  term!: number;
  monthlyPayment!: number;

  calculateCarLoan() {
    // Implement car loan calculation formula
    const r = this.annualRate / 100 / 12;
    const n = this.term * 12;
    this.monthlyPayment = (this.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

}
