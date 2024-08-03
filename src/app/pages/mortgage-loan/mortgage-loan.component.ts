import { Component } from '@angular/core';


@Component({
  selector: 'app-mortgage-loan',
  templateUrl: './mortgage-loan.component.html',
  styleUrls: ['./mortgage-loan.component.css']
})
export class MortgageLoanComponent {
  loanType: any;
  loanItemForm: any;
  dialogRef: any;
  onSubmit() {
    throw new Error('Method not implemented.');
  }


  principal!: number;
  annualRate!: number;
  term!: number;
  monthlyPayment!: number;
  showSchedule: boolean = false;
  repaymentSchedule: any[] = [];
  displayedColumns: string[] = ['month', 'interest', 'paymentPrincipal', 'total', 'runningBalance'];


  calculateMortgage() {
    const r = this.annualRate / 100 / 12;
    //const n = this.term * 12 //Use this if calculating your figures in years
    const n = this.term //Use this if calculating your figures in months
    this.monthlyPayment = (this.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    //Generate repayment schedule if checkbox is ticked
    if (this.showSchedule) {
      this.repaymentSchedule = this.generateRepaymentSchedule();
    } else {
      this.repaymentSchedule = [];
    }
  }
  generateRepaymentSchedule() {

    let schedule = [];
    let balance = this.principal;
    let month = 1;
    const r = this.annualRate / 100 / 12;

    while (balance > 0) {
      let interest = balance * r;
      let principalPayment = this.monthlyPayment - interest;
      if (balance < this.monthlyPayment) {
        this.monthlyPayment = balance + interest; // Adjust final payment if needed
        principalPayment = this.monthlyPayment - interest;
      }
      let totalPayment = interest + principalPayment;
      balance -= principalPayment;

      schedule.push({
        month: month++,
        interest: interest,
        paymentPrincipal: principalPayment,
        total: totalPayment,
        runningBalance: Math.max(balance, 0) // Avoid negative balance
      });
    }

    return schedule;
  }


}
