import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-mortgage-loan',
  templateUrl: './mortgage-loan.component.html',
  styleUrls: ['./mortgage-loan.component.css']
})
export class MortgageLoanComponent {
  loanType: any;
  loanItemForm: any;
  dialogRef: any;
 //loanForm: FormGroup<any>;
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
  selectedMethod: string = 'reducingBalanceEMI'; // Default method
  methods = [
    { label: 'Reducing Balance Method (EMI)', value: 'reducingBalanceEMI' },
    { label: 'Flat Interest (Principal Payments)', value: 'flatInterestPrincipal' },
    { label: 'Reducing Balance Method (Principal Payments)', value: 'reducingBalancePrincipal' },
    { label: 'Flat Interest EMI', value: 'flatInterestEMI' },
    { label: 'Flat Interest (On Principal Amount)', value: 'flatInterestOnPrincipal' }
  ];

  calculateMortgage() {
    switch (this.selectedMethod) {
      case 'reducingBalanceEMI':
        this.calculateReducingBalanceEMI();
        break;
      case 'flatInterestPrincipal':
        this.calculateFlatInterestPrincipal();
        break;
      case 'reducingBalancePrincipal':
        this.calculateReducingBalancePrincipal();
        break;
      case 'flatInterestEMI':
        this.calculateFlatInterestEMI();
        break;
      case 'flatInterestOnPrincipal':
        this.calculateFlatInterestOnPrincipal();
        break;
      default:
        this.calculateReducingBalanceEMI(); // Default to reducing balance EMI
        break;
    }
    
    if (this.showSchedule) {
      this.repaymentSchedule = this.generateRepaymentSchedule();
    } else {
      this.repaymentSchedule = [];
    }
  }

  // Calculation methods

  calculateReducingBalanceEMI() {
    const r = this.annualRate / 100 / 12;
    //const n = this.term * 12; //Use this if calculating your figures in years
    const n = this.term //Use this if calculating your figures in months
    this.monthlyPayment = (this.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  calculateFlatInterestPrincipal() {
    const r = this.annualRate / 100 / 12;
     //const n = this.term * 12; //Use this if calculating your figures in years
     const n = this.term //Use this if calculating your figures in months
    this.monthlyPayment = (this.principal / n) + (this.principal * r);
  }

  calculateReducingBalancePrincipal() {
    const r = this.annualRate / 100 / 12;
     //const n = this.term * 12; //Use this if calculating your figures in years
     const n = this.term //Use this if calculating your figures in months
    let totalPayment = 0;
    for (let month = 1; month <= n; month++) {
      const interest = this.principal * r;
      const principalPayment = this.principal / n;
      this.principal -= principalPayment;
      totalPayment += interest + principalPayment;
    }
    this.monthlyPayment = totalPayment / n;
  }

  calculateFlatInterestEMI() {
    const r = this.annualRate / 100 / 12;
     //const n = this.term * 12; //Use this if calculating your figures in years
     const n = this.term //Use this if calculating your figures in months
    this.monthlyPayment = (this.principal + (this.principal * r * n)) / n;
  }

  calculateFlatInterestOnPrincipal() {
    const r = this.annualRate / 100 / 12;
     //const n = this.term * 12; //Use this if calculating your figures in years
     const n = this.term //Use this if calculating your figures in months
    this.monthlyPayment = (this.principal + (this.principal * r)) / n;
  }

  generateRepaymentSchedule() {
    let schedule = [];
    let balance = this.principal;
    let month = 1;
    const r = this.annualRate / 100 / 12;

    while (balance > 0) {
      let interest, principalPayment, totalPayment;
      switch (this.selectedMethod) {
        case 'reducingBalanceEMI':
          interest = balance * r;
          principalPayment = this.monthlyPayment - interest;
          if (balance < principalPayment) {
            this.monthlyPayment = balance + interest;
            principalPayment = this.monthlyPayment - interest;
          }
          totalPayment = interest + principalPayment;
          break;
        case 'flatInterestPrincipal':
          interest = this.principal * r;
          principalPayment = this.principal / (this.term * 12);
          totalPayment = principalPayment + interest;
          break;
        case 'reducingBalancePrincipal':
          interest = balance * r;
          principalPayment = this.principal / (this.term * 12);
          totalPayment = interest + principalPayment;
          balance -= principalPayment;
          break;
        case 'flatInterestEMI':
          interest = this.principal * r;
          principalPayment = this.monthlyPayment - interest;
          totalPayment = this.monthlyPayment;
          break;
        case 'flatInterestOnPrincipal':
          interest = this.principal * r;
          principalPayment = (this.principal + interest) / (this.term * 12);
          totalPayment = principalPayment + interest;
          break;
        default:
          interest = balance * r;
          principalPayment = this.monthlyPayment - interest;
          totalPayment = interest + principalPayment;
          break;
      }

      schedule.push({
        month: month++,
        interest: interest,
        paymentPrincipal: principalPayment,
        total: totalPayment,
        runningBalance: Math.max(balance, 0)
      });

      balance -= principalPayment;
    }

    return schedule;
  }


  // calculateMortgage() {
  //   const r = this.annualRate / 100 / 12;
  //   //const n = this.term * 12 //Use this if calculating your figures in years
  //   const n = this.term //Use this if calculating your figures in months
  //   this.monthlyPayment = (this.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  //   //Generate repayment schedule if checkbox is ticked
  //   if (this.showSchedule) {
  //     this.repaymentSchedule = this.generateRepaymentSchedule();
  //   } else {
  //     this.repaymentSchedule = [];
  //   }
  // }
  // generateRepaymentSchedule() {

  //   let schedule = [];
  //   let balance = this.principal;
  //   let month = 1;
  //   const r = this.annualRate / 100 / 12;

  //   while (balance > 0) {
  //     let interest = balance * r;
  //     let principalPayment = this.monthlyPayment - interest;
  //     if (balance < this.monthlyPayment) {
  //       this.monthlyPayment = balance + interest; // Adjust final payment if needed
  //       principalPayment = this.monthlyPayment - interest;
  //     }
  //     let totalPayment = interest + principalPayment;
  //     balance -= principalPayment;

  //     schedule.push({
  //       month: month++,
  //       interest: interest,
  //       paymentPrincipal: principalPayment,
  //       total: totalPayment,
  //       runningBalance: Math.max(balance, 0) // Avoid negative balance
  //     });
  //   }

  //   return schedule;
  // }


}
