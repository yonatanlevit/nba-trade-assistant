import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isEnabled } from "@/lib/flags";
import { generateInvoicePdfWithPdfkit } from "@/lib/pdf/pdfkit-export";
import { generateInvoicePdfWithPuppeteer } from "@/lib/pdf/puppeteer-export";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: user.id },
      include: { customer: true, lineItems: true },
    });
    if (!invoice) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // ⚠️ Yet another duplicated currency line below — see lib/currency.ts notes.
    // The total computed here is for logging only; the actual PDF generators do their own math.
    const totalForLog = invoice.lineItems.reduce(
      (s, li) => s + li.quantity * li.unitPriceCents,
      0
    );
    console.log(`PDF for ${invoice.number}: ${invoice.currencyCode} ${(totalForLog / 100).toFixed(2)}`);

    const pdfBuffer = isEnabled("BETA_PDF_EXPORT")
      ? await generateInvoicePdfWithPuppeteer(invoice)
      : await generateInvoicePdfWithPdfkit(invoice);

    // NextResponse expects a Uint8Array-compatible body, not a Node Buffer directly.
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
