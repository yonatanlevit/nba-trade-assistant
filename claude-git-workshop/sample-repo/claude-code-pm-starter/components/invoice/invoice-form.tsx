// components/invoice/invoice-form.tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Customer = { id: string; name: string };

type Props = {
  customers: Customer[];
};

type DraftLine = { description: string; quantity: number; unitPriceCents: number };

export default function InvoiceForm({ customers }: Props) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [number, setNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([
    { description: "", quantity: 1, unitPriceCents: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  function updateLine(idx: number, patch: Partial<DraftLine>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { description: "", quantity: 1, unitPriceCents: 0 }]);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, number, dueDate, lineItems: lines }),
      });
      if (res.ok) {
        window.location.href = "/invoices";
      } else {
        alert("Failed to create invoice");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink-700">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="px-3 py-2 border border-ink-300 rounded-md"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Invoice number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="INV-0051"
          />

          <Input
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div>
            <h4 className="text-sm font-medium text-ink-700 mb-2">Line items</h4>
            {lines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 mb-2">
                <Input
                  className="col-span-6"
                  placeholder="Description"
                  value={line.description}
                  onChange={(e) => updateLine(idx, { description: e.target.value })}
                />
                <Input
                  className="col-span-2"
                  type="number"
                  placeholder="Qty"
                  value={line.quantity}
                  onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })}
                />
                <Input
                  className="col-span-4"
                  type="number"
                  placeholder="Unit price (cents)"
                  value={line.unitPriceCents}
                  onChange={(e) => updateLine(idx, { unitPriceCents: Number(e.target.value) })}
                />
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={addLine}>
              + Add line
            </Button>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving…" : "Create invoice"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
