import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SalaryService } from 'src/app/service/salary.service';

@Component({
  selector: 'app-salary-calculator',
  templateUrl: './salary-calculator.component.html',
  styleUrls: ['./salary-calculator.component.css']
})
export class SalaryCalculatorComponent {

  salaryForm: FormGroup;
  result: any;

  constructor(private fb: FormBuilder, private salaryService: SalaryService) {
    this.salaryForm = this.fb.group({
      grossSalary: [''],
      pensionRate: [0], // 5% employee pension rate
      deductions: this.fb.array([]),
    });
  }

  get deductions() {
    return this.salaryForm.get('deductions') as FormArray;
  }

  addDeduction() {
    const deductionGroup = this.fb.group({
      name: [''],
      amount: [0],
    });
    this.deductions.push(deductionGroup);
  }

  removeDeduction(index: number) {
    this.deductions.removeAt(index);
  }

  calculateSalary() {
    const { grossSalary, pensionRate, deductions } = this.salaryForm.value;
    this.result = this.salaryService.calculateNetSalary(grossSalary, deductions, pensionRate);
  }

  printSalarySlip() {
    window.print();
  }

}
