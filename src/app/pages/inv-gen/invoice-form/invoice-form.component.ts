import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import emailjs from 'emailjs-com'; // Import EmailJS
import html2pdf from 'html2pdf.js'; // Import html2pdf
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
  pdfData?: Blob; // Property to store the PDF Blob
  totalCost: number = 0; // Property to store the total cost
  currencyCode: string = 'USD'; // Default currency

  constructor(
    private fb: FormBuilder
    
  ) {
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
      price: [0, Validators.required],
      
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateTotalCost(): number {
    return this.items.controls.reduce((total, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      
      //return total + (quantity * price);
      return total + (price);
    }, 0);
  }

  async generatePDF() {
    const invoiceElement = document.getElementById('invoice');
    if (!invoiceElement) {
      console.error('Invoice element not found.');
      return;
    }

    // Calculate the total cost and set the currency code
    this.totalCost = this.calculateTotalCost();
    this.currencyCode = this.invoiceForm.get('currency')?.value || 'USD';
  
    // Temporarily show the element
    invoiceElement.style.display = 'block';
  
    const options = {
      margin: 1,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    try {
      const pdf = html2pdf().from(invoiceElement).set(options);
      pdf.output('blob').then((pdfBlob: Blob) => {
        this.pdfData = pdfBlob;
  
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'invoice.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
  
        // Restore visibility
        invoiceElement.style.display = 'none';
      }).catch((error: unknown) => {
        if (error instanceof Error) {
          console.error('Error generating PDF Blob:', error.message);
        } else {
          console.error('Error generating PDF Blob:', error);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error generating PDF:', error.message);
      } else {
        console.error('Error generating PDF:', error);
      }
    }
  }  
  

  async sendEmail() {
    // Ensure PDF is generated
    if (!this.pdfData) {
      console.error('PDF not generated');
      return;
    }

    // Convert the Blob to Base64 for email attachment
    const reader = new FileReader();
    reader.readAsDataURL(this.pdfData);
    reader.onloadend = () => {
      const base64data = reader.result as string;

      // Email parameters
      const templateParams = {
        to_email: this.emailForm.get('email')?.value,
        subject: 'Invoice',
        message: 'Please find the attached invoice.',
        attachment: base64data
      };

      // Send the email
      
      emailjs.send('service_tnmey0f', 'template_6bedl2n', templateParams)
        .then((response) => {
          console.log('Email sent successfully:', response);
        }, (error) => {
          console.error('Error sending email:', error);
        });
    };

    reader.onerror = (error) => {
      console.error('Error reading PDF Blob:', error);
    };
  }
}
