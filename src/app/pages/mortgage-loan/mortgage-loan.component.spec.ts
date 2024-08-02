import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageLoanComponent } from './mortgage-loan.component';

describe('MortgageLoanComponent', () => {
  let component: MortgageLoanComponent;
  let fixture: ComponentFixture<MortgageLoanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MortgageLoanComponent]
    });
    fixture = TestBed.createComponent(MortgageLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
