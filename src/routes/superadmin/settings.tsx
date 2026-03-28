import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/superadmin/settings')({
  component: SuperAdminSettingsPage,
})

function SuperAdminSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">App Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder halaman konfigurasi aplikasi.
      </p>
    </div>
  )
}
