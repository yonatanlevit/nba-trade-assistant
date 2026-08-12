import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SAMPLE_USERS = [
  { email: "demo@invoiceflow.test", name: "Demo Freelancer", currencyCode: "USD" },
  { email: "alex@invoiceflow.test", name: "Alex Designer", currencyCode: "EUR" },
  { email: "noa@invoiceflow.test", name: "Noa Developer", currencyCode: "ILS" },
  { email: "sam@invoiceflow.test", name: "Sam Consultant", currencyCode: "GBP" },
  { email: "jin@invoiceflow.test", name: "Jin Translator", currencyCode: "USD" },
];

const SAMPLE_CUSTOMER_NAMES = [
  "Acme Corp", "Globex", "Initech", "Hooli", "Pied Piper",
  "Soylent", "Wonka Industries", "Stark Industries", "Wayne Enterprises", "Cyberdyne",
  "Tyrell Corp", "Umbrella", "Massive Dynamic", "Vandelay", "Dunder Mifflin",
  "Los Pollos Hermanos", "Sterling Cooper", "Bluth Co.", "Pearson Hardman", "Aviato",
];

const LINE_ITEM_TEMPLATES = [
  { description: "Discovery & strategy session", unitPriceCents: 50000 },
  { description: "Design system audit", unitPriceCents: 120000 },
  { description: "Frontend implementation (week)", unitPriceCents: 350000 },
  { description: "Brand identity package", unitPriceCents: 800000 },
  { description: "Translation services (per 1000 words)", unitPriceCents: 8000 },
  { description: "User research interviews (5x)", unitPriceCents: 200000 },
  { description: "Hourly consultation", unitPriceCents: 15000 },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log("Seeding database...");

  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  for (const userData of SAMPLE_USERS) {
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: { ...userData, passwordHash },
    });

    const customers = await Promise.all(
      SAMPLE_CUSTOMER_NAMES.slice(0, 20).map((name) =>
        prisma.customer.create({
          data: {
            userId: user.id,
            name,
            email: `billing@${name.toLowerCase().replace(/[^a-z]/g, "")}.test`,
          },
        })
      )
    );

    let invoiceCounter = 1;
    for (let i = 0; i < 50; i++) {
      const customer = pick(customers);
      const issueOffset = Math.floor(Math.random() * 180);
      const issueDate = daysAgo(issueOffset);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      const status = pick(["draft", "sent", "sent", "paid", "paid", "overdue"]);

      const lineItems = Array.from({ length: 1 + Math.floor(Math.random() * 4) }, () => {
        const t = pick(LINE_ITEM_TEMPLATES);
        return {
          description: t.description,
          quantity: 1 + Math.floor(Math.random() * 5),
          unitPriceCents: t.unitPriceCents,
        };
      });

      const invoice = await prisma.invoice.create({
        data: {
          userId: user.id,
          customerId: customer.id,
          number: `INV-${String(invoiceCounter++).padStart(4, "0")}`,
          status,
          issueDate,
          dueDate,
          currencyCode: user.currencyCode,
          lineItems: { create: lineItems },
        },
      });

      if (status === "paid") {
        const total = lineItems.reduce((s, li) => s + li.quantity * li.unitPriceCents, 0);
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amountCents: total,
            paidAt: new Date(issueDate.getTime() + 7 * 24 * 60 * 60 * 1000),
            method: pick(["bank_transfer", "card", "cash"]),
          },
        });
      }
    }
  }

  console.log("Seeded 5 users, 20 customers each, 50 invoices each.");
  console.log("Login with email: demo@invoiceflow.test / password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
