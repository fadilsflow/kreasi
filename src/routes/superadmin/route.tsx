import { Outlet, createFileRoute, useRouter } from '@tanstack/react-router'
import React from 'react'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { useSuperAdminAuthContext } from '@/lib/super-admin-auth'

export const Route = createFileRoute('/superadmin')({
  component: SuperAdminLayout,
})

function SuperAdminLayout() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const {
    data: superAdmin,
    isPending: isSuperAdminPending,
    isError: isSuperAdminError,
  } = useSuperAdminAuthContext(Boolean(session?.user))

  React.useEffect(() => {
    if (!isPending && !session?.user) {
      router.navigate({ to: '/login' })
    }
  }, [isPending, session, router])

  React.useEffect(() => {
    if (
      !isSuperAdminPending &&
      session?.user &&
      (isSuperAdminError || !superAdmin?.isAdmin)
    ) {
      router.navigate({ to: '/' })
    }
  }, [isSuperAdminError, isSuperAdminPending, router, session, superAdmin])

  if (isPending || isSuperAdminPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
