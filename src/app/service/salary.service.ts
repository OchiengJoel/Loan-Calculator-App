import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor() { }

  private nhifBands = [
    { min: 0, max: 5999, amount: 150 },
    { min: 6000, max: 7999, amount: 300 },
    { min: 8000, max: 11999, amount: 400 },
    { min: 12000, max: 14999, amount: 500 },
    { min: 15000, max: 19999, amount: 600 },
    { min: 20000, max: 24999, amount: 750 },
    { min: 25000, max: 29999, amount: 850 },
    { min: 30000, max: 34999, amount: 900 },
    { min: 35000, max: 39999, amount: 950 },
    { min: 40000, max: 44999, amount: 1000 },
    { min: 45000, max: 49999, amount: 1100 },
    { min: 50000, max: 59999, amount: 1200 },
    { min: 60000, max: 69999, amount: 1300 },
    { min: 70000, max: 79999, amount: 1400 },
    { min: 80000, max: 89999, amount: 1500 },
    { min: 90000, max: 99999, amount: 1600 },
    { min: 100000, max: Number.MAX_VALUE, amount: 1700 },
  ]

  private nssfBands = [
    { min: 0, max: 6000, percentage: 0.06, cap: 360 },
    { min: 6001, max: 18000, percentage: 0.06, cap: 1740 },
  ];

  calculateNetSalary(grossSalary: number, deductions: any[], pensionRate: number) {
    const PAYE = this.calculatePAYE(grossSalary);
    const NSSF = this.calculateNSSF(grossSalary);
    const NHIF = this.calculateNHIF(grossSalary);

    const pensionContribution = (grossSalary * pensionRate) / 100;

    let totalDeductions = PAYE + NSSF + NHIF + pensionContribution;

    deductions.forEach(deduction => {
      totalDeductions += deduction.amount;
    });

    const netSalary = grossSalary - totalDeductions;

    return {
      grossSalary,
      PAYE,
      NSSF,
      NHIF,
      pensionContribution,
      deductions,
      netSalary,
    };
  }

  private calculatePAYE(grossSalary: number): number {
    let paye = 0;
    if (grossSalary <= 24000) {
      paye = grossSalary * 0.1;
    } else if (grossSalary <= 32333) {
      paye = 2400 + (grossSalary - 24000) * 0.15;
    } else if (grossSalary <= 40666) {
      paye = 2400 + 1250 + (grossSalary - 32333) * 0.2;
    } else if (grossSalary <= 49000) {
      paye = 2400 + 1250 + 1667 + (grossSalary - 40666) * 0.25;
    } else {
      paye = 2400 + 1250 + 1667 + 2083 + (grossSalary - 49000) * 0.3;
    }
    return paye - 2400; // Subtract personal relief
  }

  private calculateNHIF(grossSalary: number): number {
    const band = this.nhifBands.find(b => grossSalary >= b.min && grossSalary <= b.max);
    return band ? band.amount : 0;
  }

  private calculateNSSF(grossSalary: number): number {
    let nssf = 0;
    this.nssfBands.forEach(band => {
      if (grossSalary > band.min && grossSalary <= band.max) {
        nssf += Math.min(grossSalary * band.percentage, band.cap);
      }
    });
    return nssf;
  }
}
