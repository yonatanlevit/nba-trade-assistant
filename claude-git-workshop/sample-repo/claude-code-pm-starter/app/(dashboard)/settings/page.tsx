import { requireUser } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FLAGS } from "@/lib/flags";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-ink-500">Email</dt>
            <dd>{user.email}</dd>
            <dt className="text-ink-500">Default currency</dt>
            <dd>{user.currencyCode}</dd>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags (dev)</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(FLAGS).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-ink-500 font-mono">{k}</dt>
                <dd>{v ? "ON" : "OFF"}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-ink-500 mt-4">
            Flags are read from <code>lib/flags.ts</code>. Editing this UI does nothing yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
