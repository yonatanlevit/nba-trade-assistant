import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: { customer: true, lineItems: true },
      orderBy: { issueDate: "desc" },
    });
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { customerId, number, dueDate, lineItems } = body;

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        customerId,
        number,
        dueDate: new Date(dueDate),
        currencyCode: user.currencyCode,
        lineItems: { create: lineItems },
      },
    });

    return NextResponse.json(invoice);
  } catch (e) {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
