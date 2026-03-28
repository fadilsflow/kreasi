import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/superadmin/')({
  component: SuperAdminHomePage,
})

function SuperAdminHomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Super Admin</h1>
        <p className="text-sm text-muted-foreground">
          Kelola payout request, user, dan pengaturan aplikasi.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm font-medium">Payout Requests</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review & approve pencairan dana.
          </p>
          <Button
            className="mt-3"
            size="sm"
            variant="outline"
            render={<Link to="/superadmin/payouts" />}
          >
            Buka Payouts
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm font-medium">Users</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Lihat akun, status, dan data user.
          </p>
          <Button
            className="mt-3"
            size="sm"
            variant="outline"
            render={<Link to="/superadmin/users" />}
          >
            Buka Users
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-sm font-medium">App Settings</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Konfigurasi operasional aplikasi.
          </p>
          <Button
            className="mt-3"
            size="sm"
            variant="outline"
            render={<Link to="/superadmin/settings" />}
          >
            Buka Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
