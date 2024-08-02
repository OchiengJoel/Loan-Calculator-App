import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLoanComponent } from './student-loan.component';

describe('StudentLoanComponent', () => {
  let component: StudentLoanComponent;
  let fixture: ComponentFixture<StudentLoanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentLoanComponent]
    });
    fixture = TestBed.createComponent(StudentLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
