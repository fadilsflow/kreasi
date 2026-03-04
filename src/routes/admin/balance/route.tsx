import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/balance')({
  component: () => <BalanceLayout />,
})

function BalanceLayout() {
  return (
    <div className="p-6 mb-20 md:mb-0">
      <Outlet />
    </div>
  )
}
