import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailModalComponent } from './email-modal.component';

describe('EmailModalComponent', () => {
  let component: EmailModalComponent;
  let fixture: ComponentFixture<EmailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailModalComponent]
    });
    fixture = TestBed.createComponent(EmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
