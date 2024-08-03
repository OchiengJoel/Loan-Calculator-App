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

calculateMortgage() {
  const r = this.annualRate / 100 / 12;
  const n = this.term * 12;
  this.monthlyPayment = (this.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

}
