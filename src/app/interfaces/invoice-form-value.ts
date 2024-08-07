import { InvoiceItem } from "./invoice-item";

export interface InvoiceFormValue {
    
        client: string;
        invoiceNumber: string;
        date: string;
        currency: string;
        items: InvoiceItem[];
    
}
