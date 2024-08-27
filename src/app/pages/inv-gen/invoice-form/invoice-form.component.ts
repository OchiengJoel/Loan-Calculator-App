import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import emailjs from 'emailjs-com'; // Import EmailJS
import html2pdf from 'html2pdf.js'; // Import html2pdf
import { InvoiceFormValue } from 'src/app/interfaces/invoice-form-value';
import { InvoiceItem } from 'src/app/interfaces/invoice-item';
import { EmailModalComponent } from '../../email-modal/email-modal.component';

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
  subTotal: number = 0;
  totalCost: number = 0; // Property to store the total cost
  currencyCode: string = 'KES'; // Default currency
  currencyList = ["KES","USD","UGX", "TZS","EUR","ZAR","KWACHA","PESOS"]

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
    
  ) {
    this.invoiceForm = this.fb.group({
      company: ['Company A', Validators.required],
      companyPin: ['', Validators.required],
      companyEmail: ['company@info.com', Validators.required],
      companyAddress: ['', Validators.required],
      companyCity: ['Nairobi', Validators.required],
      
      client: ['Customer A', Validators.required],
      clientPin:['', Validators.required],
      clientEmail:['client@info.com', Validators.required],
      clientAddress:['', Validators.required],
      clientCity:['Kigali', Validators.required],

      invoiceNumber: ['INV-00987', Validators.required],
      date: ['', Validators.required],
      dueDate:[''],
      currency: ['', Validators.required],

      terms: ['Payment Is Due Within 15 Days', Validators.required],
      bankName:['Gulf Bank', Validators.required],
      bankNumber: ['01234509876', Validators.required],

      items: this.fb.array([this.createItem()])
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    emailjs.init('ypYUpgr1ICE-Dxnoe');  // Initialize EmailJS with your user ID

    this.setupValueChanges();
    this.setupDateChanges(); // Setup the date change listener
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, Validators.required],
      price: [0, Validators.required],
      vatRate: [0],  // New field for VAT rate
      totalPrice: [{ value: 0, disabled: true }, Validators.required]  // Disable manual input for totalPrice
  
      
    });
  }

  // addItem() {
  //   this.items.push(this.createItem());
  // }

  // removeItem(index: number) {
  //   this.items.removeAt(index);
  // }

  addItem() {
    const itemGroup = this.createItem();
    this.items.push(itemGroup);
    this.setupItemValueChanges(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotalCost();
  }

  setupValueChanges() {
    this.items.controls.forEach((itemGroup) => {
      this.setupItemValueChanges(itemGroup as FormGroup);
    });
  }

  setupItemValueChanges(itemGroup: FormGroup) {
    itemGroup.get('quantity')?.valueChanges.subscribe(() => {
      this.updateTotalPrice(itemGroup);
    });

    itemGroup.get('price')?.valueChanges.subscribe(() => {
      this.updateTotalPrice(itemGroup);
    });
  }

  // updateTotalPrice(itemGroup: FormGroup) {
  //   const quantity = itemGroup.get('quantity')?.value || 0;
  //   const price = itemGroup.get('price')?.value || 0;
  //   const totalPrice = quantity * price;
  //   itemGroup.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
  //   this.calculateTotalCost();
  // }

  updateTotalPrice(itemGroup: FormGroup) {
    const quantity = itemGroup.get('quantity')?.value || 0;
    const price = itemGroup.get('price')?.value || 0;
    const vatRate = itemGroup.get('vatRate')?.value || 0;

    let totalPrice = quantity * price;
    if (vatRate > 0) {
      totalPrice += totalPrice * (vatRate / 100);
    }

    itemGroup.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
    this.calculateTotalCost();
  }

  // calculateTotalCost(): number {
  //   const total = this.items.controls.reduce((sum, item) => {
  //     const totalPrice = item.get('totalPrice')?.value || 0;
  //     return sum + totalPrice;
  //   }, 0);
  //   this.totalCost = total;
    
  //   return total;
  // }

  calculateTotalCost(): number {
    return this.items.controls.reduce((total, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      const vatRate = item.get('vatRate')?.value || 0;
      const itemTotal = quantity * price * (1 + vatRate / 100);
      item.get('totalPrice')?.setValue(itemTotal);
      return total + itemTotal;
    }, 0);
  }

  calculateSubtotal(): number {
    return this.items.controls.reduce((subtotal, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return subtotal + (quantity * price);
    }, 0);
  }

  calculateVAT(): number {
    return this.items.controls.reduce((vatTotal, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      const vatRate = item.get('vatRate')?.value || 0;
      return vatTotal + (quantity * price * (vatRate / 100));
    }, 0);
  }

  // calculateTotalCost(): number {
  //   return this.items.controls.reduce((total, item) => {
  //     const quantity = item.get('quantity')?.value || 0;
  //     const price = item.get('price')?.value || 0;
      
  //     //return total + (quantity * price);
  //     return total + (price);
  //   }, 0);
  // }

  setupDateChanges() {
    this.invoiceForm.get('date')?.valueChanges.subscribe(date => {
      if (date) {
        this.updateDueDate(new Date(date));
      }
    });
  }

  updateDueDate(invoiceDate: Date) {
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30); // Add 30 days
    this.invoiceForm.get('dueDate')?.setValue(dueDate.toISOString().split('T')[0], { emitEvent: false });
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

  openEmailModal() {
    this.dialog.open(EmailModalComponent, {
      width: '400px'
    })
  }
}
