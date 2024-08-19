import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor() { }

  // PAYE rates effective from 1 July 2023
  private payeBands = [
    { min: 0, max: 24000, rate: 0.10 },
    { min: 24001, max: 32333, rate: 0.25 },
    { min: 32334, max: 500000, rate: 0.30 },
    { min: 500001, max: 800000, rate: 0.325 },
    { min: 800001, max: Number.MAX_VALUE, rate: 0.35 },
  ];

  // NHIF Bands
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
  ];

  // NSSF Contributions as per February 2024 onwards
  private nssfBands = [
    { min: 0, max: 7000, percentage: 0.06, cap: 420 }, // Tier I
    { min: 7001, max: 36000, percentage: 0.06, cap: 1740 }, // Tier II
  ];

  // Housing Levy
  private housingLevyRate = 0.015; // 1.5%

  calculateNetSalary(grossSalary: number, deductions: any[], pensionRate: number) {
    const nssf = this.calculateNSSF(grossSalary);
    const nhif = this.calculateNHIF(grossSalary);
    const housingLevy = grossSalary * this.housingLevyRate;

    // Calculate Taxable Income after NSSF deduction
    const taxableIncome = grossSalary - nssf;

    // Calculate PAYE
    const paye = this.calculatePAYE(taxableIncome);

    // Calculate Pension Contribution (Employee portion)
    const pensionContribution = (grossSalary * pensionRate) / 100;

    // Calculate Insurance Relief on NHIF (15% of NHIF)
    const insuranceRelief = nhif * 0.15;

    // Apply PAYE Reliefs (Personal Relief and Insurance Relief)
    const payeAfterReliefs = paye - 2400 - insuranceRelief;

    //Monthly Personal Relief
    const monthlyPersonalRelief = 2400;

    // Sum up all deductions
    let totalDeductions = payeAfterReliefs + nssf + nhif + housingLevy + pensionContribution;

    // Add any other deductions specified by the user
    deductions.forEach(deduction => {
      totalDeductions += deduction.amount;
    });

    // Calculate Net Salary
    const netSalary = grossSalary - totalDeductions;

    return {
      grossSalary,
      taxableIncome,
      paye: payeAfterReliefs,
      nssf,
      nhif,
      insuranceRelief,
      housingLevy,
      monthlyPersonalRelief,
      pensionContribution,
      deductions,
      totalDeductions,
      netSalary,
    };
  }

  // Calculate PAYE based on graduated tax rates
  private calculatePAYE(taxableIncome: number): number {
    let paye = 0;
    for (const band of this.payeBands) {
      if (taxableIncome > band.min) {
        const taxableAmount = Math.min(taxableIncome, band.max) - band.min;
        paye += taxableAmount * band.rate;
      }
    }
    return paye;
  }

  // private calculatePAYE(grossSalary: number): number {
  //   let paye = 0;
  //   if (grossSalary <= 24000) {
  //     paye = grossSalary * 0.1;
  //   } else if (grossSalary <= 32333) {
  //     paye = 2400 + (grossSalary - 24000) * 0.15;
  //   } else if (grossSalary <= 40666) {
  //     paye = 2400 + 1250 + (grossSalary - 32333) * 0.2;
  //   } else if (grossSalary <= 49000) {
  //     paye = 2400 + 1250 + 1667 + (grossSalary - 40666) * 0.25;
  //   } else {
  //     paye = 2400 + 1250 + 1667 + 2083 + (grossSalary - 49000) * 0.3;
  //   }
  //   return paye - 2400; // Subtract personal relief
  // }



  // Calculate NHIF based on gross salary
  private calculateNHIF(grossSalary: number): number {
    const band = this.nhifBands.find(b => grossSalary >= b.min && grossSalary <= b.max);
    return band ? band.amount : 0;
  }

  // Calculate NSSF based on gross salary
  private calculateNSSF(grossSalary: number): number {
    let nssf = 0;
    this.nssfBands.forEach(band => {
      if (grossSalary > band.min) {
        const pensionableAmount = Math.min(grossSalary, band.max) - band.min;
        nssf += Math.min(pensionableAmount * band.percentage, band.cap);
      }
    });
    return nssf;
  }
}
