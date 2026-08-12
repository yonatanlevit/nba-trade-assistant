// lib/pdf/puppeteer-export.ts
//
// NEWER PDF export implementation, using puppeteer to render an HTML template.
// Started as a migration from pdfkit. Behind the BETA_PDF_EXPORT flag.
// ⚠️ NOT FINISHED. The HTML template lacks styling. Currency formatting is also wrong here.

import puppeteer from "puppeteer";

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

function renderHtml(invoice: InvoiceForPdf): string {
  // ⚠️ Currency formatting is duplicated AGAIN here, with yet another approach.
  const total = invoice.lineItems.reduce(
    (s, li) => s + li.quantity * li.unitPriceCents,
    0
  );

  const rows = invoice.lineItems
    .map(
      (li) => `<tr>
        <td>${li.description}</td>
        <td>${li.quantity}</td>
        <td>${(li.unitPriceCents / 100).toFixed(2)}</td>
        <td>${((li.quantity * li.unitPriceCents) / 100).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  // TODO: import the design system tokens here. Right now this is unstyled.
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Invoice ${invoice.number}</title></head>
<body>
  <h1>INVOICE #${invoice.number}</h1>
  <p>Bill to: ${invoice.customer.name}</p>
  <p>Issued: ${invoice.issueDate.toDateString()}</p>
  <p>Due: ${invoice.dueDate.toDateString()}</p>
  <table>
    <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <h3>Total: ${invoice.currencyCode}${(total / 100).toFixed(2)}</h3>
</body></html>`;
}

export async function generateInvoicePdfWithPuppeteer(invoice: InvoiceForPdf): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(renderHtml(invoice), { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4" });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
