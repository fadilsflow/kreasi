import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/superadmin/payouts')({
  component: SuperAdminPayoutsPage,
})

function SuperAdminPayoutsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Payout Requests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder halaman review & approval payout manual.
      </p>
    </div>
  )
}
