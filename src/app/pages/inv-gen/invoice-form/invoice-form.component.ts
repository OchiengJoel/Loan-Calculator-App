import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { InvoiceFormValue } from 'src/app/interfaces/invoice-form-value';
import { InvoiceItem } from 'src/app/interfaces/invoice-item';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent {

  invoiceForm: FormGroup;
  emailFormVisible: boolean = false;
  emailForm: FormGroup;
  pdfData?: string; // Property to store the PDF data

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      client: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      date: ['', Validators.required],
      currency: ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    emailjs.init('ypYUpgr1ICE-Dxnoe');  // Initialize EmailJS with your user ID
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, Validators.required],
      price: [0, Validators.required]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  generatePDF() {
    const doc = new jsPDF();
    const formValue: InvoiceFormValue = this.invoiceForm.value;
  
    // Add content to the PDF
    doc.text('Invoice', 14, 16);
    doc.text(`Client: ${formValue.client}`, 14, 30);
    doc.text(`Invoice Number: ${formValue.invoiceNumber}`, 14, 40);
    doc.text(`Date: ${formValue.date}`, 14, 50);
    doc.text(`Currency: ${formValue.currency}`, 14, 60);
  
    autoTable(doc, {
      startY: 70,
      head: [['Description', 'Quantity', 'Price']],
      body: formValue.items.map((item: InvoiceItem) => [
        item.description,
        item.quantity,
        item.price
      ])
    });
  
    // Generate PDF data URI
    this.pdfData = doc.output('datauristring');
  
    // Optionally preview the generated PDF
     window.open(this.pdfData);
  
    // If email form is visible, send the email
    //if (this.emailFormVisible) {
     // this.emailFormVisible = false;
     // this.sendEmail();
    }// else {
      // You may want to enable the email form here or handle differently
     // console.log("PDF generated but email form is not visible.");
   // }
 // }
  

   sendEmail() {
  //   if (!this.pdfData) {
  //     console.error('PDF data is not available.');
  //     return;
  //   }
  
  //   const emailData = {
  //     to_email: this.emailForm.get('email')?.value,
  //     subject: 'Invoice',
  //     message: 'Please find the attached invoice.',
  //     attachment: this.pdfData
  //   };
  
  //   emailjs.send('service_tnmey0f', 'template_6bedl2n', emailData)
  //     .then((response: EmailJSResponseStatus) => {
  //       console.log('Email sent successfully:', response);
  //     })
  //     .catch((error: any) => {
  //       console.error('Error sending email:', error);
  //     });
   }
  
}