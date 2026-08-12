// lib/pdf/pdfkit-export.ts
//
// The ORIGINAL PDF export implementation.
// Slow on invoices with >50 line items. See known issues in README.
// Migration to puppeteer was started (see ./puppeteer-export.ts) and abandoned.

import PDFDocument from "pdfkit";

type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

type InvoiceForPdf = {
  number: string;
  issueDate: Date;
  dueDate: Date;
  customer: { name: string; email?: string | null };
  lineItems: InvoiceLineItem[];
  currencyCode: string;
};

export async function generateInvoicePdfWithPdfkit(invoice: InvoiceForPdf): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(20).text("INVOICE", { align: "right" });
      doc.fontSize(10).text(`#${invoice.number}`, { align: "right" });
      doc.moveDown();

      doc.fontSize(12).text(`Bill to: ${invoice.customer.name}`);
      if (invoice.customer.email) doc.fontSize(10).text(invoice.customer.email);
      doc.moveDown();

      doc.fontSize(10).text(`Issued: ${invoice.issueDate.toDateString()}`);
      doc.text(`Due: ${invoice.dueDate.toDateString()}`);
      doc.moveDown();

      // Line items — naive layout, this is what's slow on big invoices
      let total = 0;
      for (const li of invoice.lineItems) {
        const lineTotal = li.quantity * li.unitPriceCents;
        total += lineTotal;
        doc
          .fontSize(10)
          .text(
            `${li.description}  —  ${li.quantity} × ${(li.unitPriceCents / 100).toFixed(2)}  =  ${(lineTotal / 100).toFixed(2)}`
          );
      }

      doc.moveDown();
      // ⚠️ Currency formatting duplicated here — should use lib/currency.ts
      doc.fontSize(12).text(`Total: ${invoice.currencyCode} ${(total / 100).toFixed(2)}`, {
        align: "right",
      });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
