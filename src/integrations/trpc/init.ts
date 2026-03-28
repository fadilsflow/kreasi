import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { eq } from 'drizzle-orm'
import { getSessionFromHeaders } from '@/lib/auth-server'
import { db } from '@/db'
import { user } from '@/db/schema'

export async function createTRPCContext({ req }: { req: Request }) {
  const session = await getSessionFromHeaders(req.headers)

  const forwardedFor = req.headers.get('x-forwarded-for')
  const clientIp =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    (forwardedFor ? forwardedFor.split(',')[0]?.trim() : null)
  const userAgent = req.headers.get('user-agent')

  return {
    session,
    requestMeta: {
      clientIp: clientIp ?? null,
      userAgent: userAgent ?? null,
    },
  }
}

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
  })

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, input, next }) => {
  if (!ctx.session || !ctx.session.user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const requestedUserId = (input as { userId?: unknown } | undefined)?.userId
  if (
    typeof requestedUserId === 'string' &&
    requestedUserId !== ctx.session.user.id
  ) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const actorUserId = ctx.session.user.id
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, actorUserId),
    columns: {
      id: true,
      isAdmin: true,
    },
  })

  if (!currentUser?.isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({
    ctx: {
      ...ctx,
    },
  })
})
