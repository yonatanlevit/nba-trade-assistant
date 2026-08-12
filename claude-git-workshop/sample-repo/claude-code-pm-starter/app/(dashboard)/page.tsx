import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FLAGS } from "@/lib/flags";

// ⚠️ DUPLICATE: yet another local currency formatter on the dashboard.
// See lib/currency.ts. This one drops the currency symbol entirely on EUR/ILS.
function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function DashboardPage() {
  if (FLAGS.NEW_DASHBOARD) {
    // The redesign isn't done. Don't render it.
    return <div>Dashboard redesign in progress.</div>;
  }

  const user = await requireUser();

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { lineItems: true, payments: true },
  });

  const totalInvoiced = invoices.reduce(
    (sum, inv) =>
      sum + inv.lineItems.reduce((s, li) => s + li.quantity * li.unitPriceCents, 0),
    0
  );

  const totalPaid = invoices.reduce(
    (sum, inv) => sum + inv.payments.reduce((s, p) => s + p.amountCents, 0),
    0
  );

  const overdueCount = invoices.filter((i) => i.status === "overdue").length;
  const draftCount = invoices.filter((i) => i.status === "draft").length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-ink-500">Total invoiced</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fmt(totalInvoiced)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-ink-500">Total paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fmt(totalPaid)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-ink-500">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-ink-500">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{draftCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
