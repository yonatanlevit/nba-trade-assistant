import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import InvoiceForm from "@/components/invoice/invoice-form";

export default async function NewInvoicePage() {
  const user = await requireUser();
  const customers = await prisma.customer.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">New invoice</h1>
      <InvoiceForm customers={customers.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
