import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MortgageLoanComponent } from './pages/mortgage-loan/mortgage-loan.component';
import { CarLoanComponent } from './pages/car-loan/car-loan.component';
import { StudentLoanComponent } from './pages/student-loan/student-loan.component';
import { BusinessLoanComponent } from './pages/business-loan/business-loan.component';

@NgModule({
  declarations: [
    AppComponent,
    MortgageLoanComponent,
    CarLoanComponent,
    StudentLoanComponent,
    BusinessLoanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
