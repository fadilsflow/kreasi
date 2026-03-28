import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/superadmin/users')({
  component: SuperAdminUsersPage,
})

function SuperAdminUsersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder halaman manajemen user.
      </p>
    </div>
  )
}
