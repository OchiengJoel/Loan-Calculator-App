import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent {

  emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendEmail() {
    if (this.emailForm.invalid) {
      return;
    }

    const email = this.emailForm.get('email')?.value;

    const templateParams = {
      to_email: email,
      subject: 'Repayment Schedule',
      message: 'Please find the attached repayment schedule.'
    };

    emailjs.send('service_tnmey0f', 'template_6bedl2n', templateParams, 'ypYUpgr1ICE-Dxnoe')
      .then((response: EmailJSResponseStatus) => {
        console.log('Email sent successfully', response);
        alert(`Repayment schedule sent to ${email}`);
        this.dialogRef.close();
      })
      .catch((error) => {
        console.error('Error sending email', error);
        alert('Error sending email');
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
