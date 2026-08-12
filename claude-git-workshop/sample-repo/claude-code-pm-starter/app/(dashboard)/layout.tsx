import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // After redirect() above, session.user is guaranteed defined — assert for the type checker.
  const user = session!.user!;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-ink-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-brand-600">
            InvoiceFlow
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-ink-700 hover:text-ink-900">
              Dashboard
            </Link>
            <Link href="/invoices" className="text-sm text-ink-700 hover:text-ink-900">
              Invoices
            </Link>
            <Link href="/customers" className="text-sm text-ink-700 hover:text-ink-900">
              Customers
            </Link>
            <Link href="/settings" className="text-sm text-ink-700 hover:text-ink-900">
              Settings
            </Link>
            <span className="text-sm text-ink-500">{user.email}</span>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
