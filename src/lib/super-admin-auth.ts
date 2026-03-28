import { queryOptions, useQuery } from '@tanstack/react-query'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'

export type SuperAdminAuthContextData = {
  userId: string
  username: string | null
  name: string | null
  email: string
  image: string | null
  isAdmin: boolean
}

export function superAdminAuthQueryKey() {
  return ['super-admin-auth'] as const
}

export function superAdminAuthQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: superAdminAuthQueryKey(),
    queryFn: async (): Promise<SuperAdminAuthContextData> => {
      return await trpcClient.superAdmin.getContext.query()
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

export function useSuperAdminAuthContext(enabled = true) {
  return useQuery(superAdminAuthQueryOptions(enabled))
}
