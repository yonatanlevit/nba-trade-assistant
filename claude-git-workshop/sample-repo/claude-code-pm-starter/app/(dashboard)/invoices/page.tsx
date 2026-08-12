import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import InvoiceList from "@/components/invoice/invoice-list";
import Button from "@/components/ui/button";
import { totalCents } from "@/lib/currency";

export default async function InvoicesPage() {
  const user = await requireUser();
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { customer: true, lineItems: true },
    orderBy: { issueDate: "desc" },
  });

  const rows = invoices.map((inv) => ({
    id: inv.id,
    number: inv.number,
    status: inv.status,
    customerName: inv.customer.name,
    totalCents: totalCents(inv.lineItems),
    currencyCode: inv.currencyCode,
    dueDate: inv.dueDate,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Invoices</h1>
        <Link href="/invoices/new">
          <Button>+ New invoice</Button>
        </Link>
      </div>
      <InvoiceList invoices={rows} />
    </div>
  );
}
