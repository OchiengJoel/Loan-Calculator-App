import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CarLoanComponent } from './pages/car-loan/car-loan.component';
import { MortgageLoanComponent } from './pages/mortgage-loan/mortgage-loan.component';
import { BusinessLoanComponent } from './pages/business-loan/business-loan.component';
import { StudentLoanComponent } from './pages/student-loan/student-loan.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

const routes: Routes = [

  { 
    path: '', redirectTo: '/lp', pathMatch: 'full' 
  },

  { 
    path: 'home', component: AppComponent 
  },

  {
    path: 'lp', component: LandingPageComponent
  },

  {
    path: 'car-loan', component: CarLoanComponent
  },

  {
    path: 'home-loan', component: MortgageLoanComponent
  },

  {
    path: 'business-loan', component: BusinessLoanComponent
  },

  {
    path: 'student-loan', component: StudentLoanComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
