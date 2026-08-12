// components/invoice/invoice-list.tsx
import Link from "next/link";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";

type InvoiceRow = {
  id: string;
  number: string;
  status: string;
  customerName: string;
  totalCents: number;
  currencyCode: string;
  dueDate: Date;
};

type Props = {
  invoices: InvoiceRow[];
};

// ⚠️ DUPLICATE: This local formatter repeats logic that lives in lib/currency.ts.
// One of the workshop's deliberate complexity hotspots.
function formatMoney(cents: number, currency: string): string {
  // Note: this also doesn't handle non-USD correctly. Inconsistent with the canonical formatter.
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

function statusVariant(status: string): "default" | "success" | "warning" | "danger" {
  if (status === "paid") return "success";
  if (status === "overdue") return "danger";
  if (status === "sent") return "warning";
  return "default";
}

export default function InvoiceList({ invoices }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Number</TableHeader>
          <TableHeader>Customer</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Due</TableHeader>
          <TableHeader>Total</TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-mono">{inv.number}</TableCell>
            <TableCell>{inv.customerName}</TableCell>
            <TableCell>
              <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
            </TableCell>
            <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>{formatMoney(inv.totalCents, inv.currencyCode)}</TableCell>
            <TableCell>
              <Link
                href={`/invoices/${inv.id}`}
                className="text-brand-600 hover:text-brand-700 text-sm"
              >
                View →
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
