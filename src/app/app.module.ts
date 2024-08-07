import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card'

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import MatCheckboxModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MortgageLoanComponent } from './pages/mortgage-loan/mortgage-loan.component';
import { CarLoanComponent } from './pages/car-loan/car-loan.component';
import { StudentLoanComponent } from './pages/student-loan/student-loan.component';
import { BusinessLoanComponent } from './pages/business-loan/business-loan.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InvoiceComponent } from './pages/inv-gen/invoice/invoice.component';
import { InvoiceFormComponent } from './pages/inv-gen/invoice-form/invoice-form.component';
import { ItemLineComponent } from './pages/inv-gen/item-line/item-line.component';
import { EmailModalComponent } from './pages/email-modal/email-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MortgageLoanComponent,
    CarLoanComponent,
    StudentLoanComponent,
    BusinessLoanComponent,
    LandingPageComponent,
    InvoiceComponent,
    InvoiceFormComponent,
    ItemLineComponent,
    EmailModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,    
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule, 
    MatFormFieldModule,
    MatToolbarModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
