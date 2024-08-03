import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import MatCheckboxModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule

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
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
