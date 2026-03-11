import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { metaPixelConfigs, user } from '@/db/schema'

export const getPublicProfile = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: username }) => {
    const dbUser = await db.query.user.findFirst({
      where: eq(user.username, username),
      with: {
        blocks: {
          where: (blocks, { eq: equals }) => equals(blocks.isEnabled, true),
          orderBy: (blocks, { asc }) => [asc(blocks.order)],
        },
        products: {
          where: (products, { and, eq: equals }) =>
            and(
              equals(products.isActive, true),
              equals(products.isDeleted, false),
            ),
        },
        socialLinks: {
          where: (socialLinks, { eq: equals }) =>
            equals(socialLinks.isEnabled, true),
          orderBy: (socialLinks, { asc }) => [asc(socialLinks.order)],
        },
      },
    })

    if (!dbUser) {
      return null
    }

    return {
      user: dbUser,
      blocks: dbUser.blocks,
      products: dbUser.products,
      socialLinks: dbUser.socialLinks,
    }
  })

export const getDashboardData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getServerSession } = await import('@/lib/auth-server')
    const session = await getServerSession()

    if (!session?.user.id) {
      throw new Error('Unauthorized')
    }

    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      with: {
        blocks: {
          orderBy: (blocks, { asc }) => [asc(blocks.order)],
        },
        products: {
          // Show all non-deleted products in dashboard (including inactive)
          where: (products, { eq: equals }) =>
            equals(products.isDeleted, false),
          orderBy: (products, { desc }) => [desc(products.createdAt)],
        },
        socialLinks: {
          orderBy: (socialLinks, { asc }) => [asc(socialLinks.order)],
        },
      },
    })

    if (!dbUser) {
      throw new Error('User not found')
    }

    return {
      user: dbUser,
      blocks: dbUser.blocks,
      products: dbUser.products,
      socialLinks: dbUser.socialLinks,
    }
  },
)

export const getPublicProduct = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      username: z.string(),
      productId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const dbUser = await db.query.user.findFirst({
      where: eq(user.username, data.username),
      with: {
        metaPixelConfigs: true,
        products: {
          where: (product, { and, eq: equals }) =>
            and(
              equals(product.id, data.productId),
              equals(product.isActive, true),
              equals(product.isDeleted, false),
            ),
        },
      },
    })

    if (!dbUser || dbUser.products.length === 0) {
      return null
    }

    return {
      user: dbUser,
      product: dbUser.products[0],
      metaPixelConfig: dbUser.metaPixelConfigs[0] ?? null,
    }
  })

export const getOrderByToken = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const {
      ORDER_STATUS,
      orders,
      paymentSessions,
    } = await import('@/db/schema')
    const {
      calculatePaymentGatewayFee,
      calculatePlatformServiceFee,
      getPaymentMethodCatalogEntry,
    } = await import('@/lib/payment-methods')

    const order = await db.query.orders.findFirst({
      where: eq(orders.deliveryToken, data.token),
      with: {
        product: true,
        creator: true,
        items: {
          with: {
            product: true,
            creator: true,
          },
        },
      },
    })

    if (!order || order.status !== ORDER_STATUS.COMPLETED) return null

    const itemSnapshots =
      order.items.length > 0
        ? order.items
        : [
            {
              id: 'legacy',
              orderId: order.id,
              creatorId: order.creatorId,
              productId: order.productId,
              productTitle: order.productTitle,
              productImage: order.productImage,
              quantity: order.quantity,
              amountPaid: order.amountPaid,
              checkoutAnswers: order.checkoutAnswers ?? {},
              product: order.product,
              creator: order.creator,
            },
          ]

    const deliveryItems = await Promise.all(
      itemSnapshots.map(async (item: any) => {
        const productData = item.product ?? {
          title: item.productTitle,
          images: item.productImage ? [item.productImage] : [],
          productContent: null,
        }

        const creatorData = item.creator ?? {
          name: 'Creator',
          email: '',
          image: null,
          username: null,
        }

        return {
          id: item.id,
          productId: item.productId,
          title: item.productTitle ?? productData.title,
          image: item.productImage || productData.images?.[0] || null,
          quantity: item.quantity ?? 1,
          amountPaid: item.amountPaid ?? 0,
          checkoutAnswers: item.checkoutAnswers ?? {},
          productContent: productData.productContent ?? null,
          creator: creatorData,
        }
      }),
    )

    const primaryCreator = deliveryItems[0]?.creator ?? {
      name: 'Creator',
      email: '',
      image: null,
      username: null,
    }

    const groupOrders = order.checkoutGroupId
      ? await db.query.orders.findMany({
          where: eq(orders.checkoutGroupId, order.checkoutGroupId),
          columns: {
            id: true,
            productTitle: true,
            amountPaid: true,
            quantity: true,
            deliveryToken: true,
            status: true,
            createdAt: true,
          },
        })
      : [order]

    const subtotalAmount = groupOrders.reduce(
      (total, groupOrder) => total + groupOrder.amountPaid,
      0,
    )

    const paymentSession = order.checkoutGroupId
      ? await db.query.paymentSessions.findFirst({
          where: eq(paymentSessions.checkoutGroupId, order.checkoutGroupId),
        })
      : null

    const requestedMethod = paymentSession?.requestedPaymentMethod
    const selectedPaymentMethod = requestedMethod
      ? getPaymentMethodCatalogEntry(requestedMethod as any)
      : null
    const serviceFeeAmount =
      requestedMethod
        ? calculatePlatformServiceFee(subtotalAmount)
        : 0
    const gatewayFeeAmount =
      requestedMethod
        ? calculatePaymentGatewayFee(subtotalAmount, requestedMethod as any)
        : 0

    const metaPixelConfig = order.creatorId
      ? await db.query.metaPixelConfigs.findFirst({
          where: eq(metaPixelConfigs.userId, order.creatorId),
        })
      : null

    return {
      order,
      items: deliveryItems,
      groupOrders,
      creator: primaryCreator,
      paymentSummary: paymentSession
        ? {
            status: paymentSession.status,
            paymentType: paymentSession.paymentType,
            requestedPaymentMethod: paymentSession.requestedPaymentMethod,
            selectedPaymentMethod,
            paidAt: paymentSession.paidAt?.toISOString() ?? null,
            expiresAt: paymentSession.expiresAt?.toISOString() ?? null,
            amountBreakdown: {
              subtotalAmount,
              serviceFeeAmount,
              gatewayFeeAmount,
              totalAmount:
                subtotalAmount + serviceFeeAmount + gatewayFeeAmount,
            },
          }
        : null,
      metaPixelConfig: metaPixelConfig ?? null,
    }
  })
