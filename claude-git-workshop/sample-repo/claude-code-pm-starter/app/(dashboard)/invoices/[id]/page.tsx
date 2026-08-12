import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { formatCents, totalCents } from "@/lib/currency";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, userId: user.id },
    include: { customer: true, lineItems: true, payments: true },
  });

  if (!invoice) notFound();

  const total = totalCents(invoice.lineItems);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{invoice.number}</h1>
          <p className="text-ink-500">{invoice.customer.name}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{invoice.status}</Badge>
          <a href={`/api/pdf/${invoice.id}`} target="_blank" rel="noreferrer">
            <Button variant="secondary">Download PDF</Button>
          </a>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Description</TableHeader>
                <TableHeader>Qty</TableHeader>
                <TableHeader>Unit</TableHeader>
                <TableHeader>Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.lineItems.map((li) => (
                <TableRow key={li.id}>
                  <TableCell>{li.description}</TableCell>
                  <TableCell>{li.quantity}</TableCell>
                  <TableCell>{formatCents(li.unitPriceCents, invoice.currencyCode)}</TableCell>
                  <TableCell>
                    {formatCents(li.quantity * li.unitPriceCents, invoice.currencyCode)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right text-lg font-semibold">
            Total: {formatCents(total, invoice.currencyCode)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
