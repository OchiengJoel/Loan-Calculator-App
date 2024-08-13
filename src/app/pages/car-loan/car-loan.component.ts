import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-car-loan',
  templateUrl: './car-loan.component.html',
  styleUrls: ['./car-loan.component.css']
})
export class CarLoanComponent {

  carLoanForm: FormGroup;

  carValue!: number;
  initialDeposit!: number;
  principal!: number;
  annualRate!: number;
  term!: number;
  monthlyPayment!: number;  
  totalRepayment: number = 0;
  cumulativeInterest: number = 0;
  showSchedule: boolean = false;
  emailFormVisible: boolean = false;
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

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.carLoanForm = this.fb.group({
      carValue: [0, [Validators.required, Validators.min(0)]],
      initialDeposit: [0, [Validators.required, Validators.min(0)]],
      annualRate: [0, [Validators.required, Validators.min(0)]],
      term: [0, [Validators.required, Validators.min(1)]],
      method: ['reducingBalanceEMI', Validators.required],
      showSchedule: [false]
    });
   
  }

  calculateCarLoan() {
    console.log('Calculate button clicked!');
    if (this.carLoanForm.invalid) {
      return;
    }

    const { carValue, initialDeposit, annualRate, term, method, showSchedule } = this.carLoanForm.value;
    this.carValue = carValue;
    this.initialDeposit = initialDeposit;
    this.principal = this.carValue - this.initialDeposit; // Calculating the principal as the financed amount
    this.annualRate = annualRate;
    this.term = term;
    this.selectedMethod = method;
    this.showSchedule = showSchedule;

    switch (this.selectedMethod) {
      case 'rcingBedualanceEMI':
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

    this.totalRepayment = this.calculateTotalRepayment();
    this.cumulativeInterest = this.totalRepayment - this.principal;

    if (this.showSchedule) {
      this.repaymentSchedule = this.generateRepaymentSchedule();
    } else {
      this.repaymentSchedule = [];
    }
  }

  calculateReducingBalanceEMI() {
    const r = this.annualRate / 100 / 12;
    const n = this.term;
    this.monthlyPayment = (this.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  calculateFlatInterestPrincipal() {
    const r = this.annualRate / 100 / 12;
    const n = this.term;
    this.monthlyPayment = (this.principal / n) + (this.principal * r);
  }

  calculateReducingBalancePrincipal() {
    const r = this.annualRate / 100 / 12;
    const n = this.term;
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
    const n = this.term;
    this.monthlyPayment = (this.principal + (this.principal * r * n)) / n;
  }

  calculateFlatInterestOnPrincipal() {
    const r = this.annualRate / 100 / 12;
    const n = this.term;
    this.monthlyPayment = (this.principal + (this.principal * r)) / n;
  }

  calculateTotalRepayment() {
    const n = this.term;
    return this.monthlyPayment * n;
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
          principalPayment = this.principal / this.term;
          totalPayment = principalPayment + interest;
          break;
        case 'reducingBalancePrincipal':
          interest = balance * r;
          principalPayment = this.principal / this.term;
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
          principalPayment = (this.principal + interest) / this.term;
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

  exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(this.repaymentSchedule, { header: ['month', 'interest', 'paymentPrincipal', 'total', 'runningBalance'] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
    XLSX.writeFile(wb, 'RepaymentSchedule.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Month', 'Interest', 'Payment Principal', 'Total', 'Running Balance']],
      body: this.repaymentSchedule.map(item => [
        item.month,
        item.interest.toFixed(2),
        item.paymentPrincipal.toFixed(2),
        item.total.toFixed(2),
        item.runningBalance.toFixed(2)
      ]),
      margin: { top: 20 },
      startY: 30
    });
    doc.save('RepaymentSchedule.pdf');
  }

  openEmailModal() {
    this.dialog.open(EmailModalComponent, {
      width: '400px'
    });
  }


}
