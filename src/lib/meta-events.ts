import { createHash } from 'node:crypto'
import { BASE_URL } from '@/lib/constans'

export async function sendMetaPurchaseEvent(params: {
  pixelId: string
  accessToken: string
  eventName?: 'ViewContent' | 'InitiateCheckout' | 'Purchase'
  eventId: string
  eventSourceUrl?: string | null
  value: number
  currency?: string
  buyerEmail?: string
  productId?: string | null
  productTitle?: string
  contentType?: string
  orderId?: string
  paymentMethod?: string | null
  clientIpAddress?: string | null
  clientUserAgent?: string | null
  fbp?: string | null
  fbc?: string | null
}): Promise<void> {
  const normalizedEmail = params.buyerEmail?.trim().toLowerCase()
  const userData: Record<string, unknown> = normalizedEmail
    ? {
        em: [createHash('sha256').update(normalizedEmail).digest('hex')],
      }
    : {}

  if (params.clientIpAddress) {
    userData.client_ip_address = params.clientIpAddress
  }

  if (params.clientUserAgent) {
    userData.client_user_agent = params.clientUserAgent
  }

  if (params.fbp) {
    userData.fbp = params.fbp
  }

  if (params.fbc) {
    userData.fbc = params.fbc
  }

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${encodeURIComponent(params.pixelId)}/events?access_token=${encodeURIComponent(params.accessToken)}`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            event_name: params.eventName ?? 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_id: params.eventId,
            event_source_url: params.eventSourceUrl ?? BASE_URL,
            user_data: userData,
            custom_data: {
              currency: params.currency ?? 'IDR',
              value: params.value,
              content_type: params.contentType ?? 'product',
              content_name: params.productTitle ?? 'Product',
              content_ids: params.productId ? [params.productId] : undefined,
              order_id: params.orderId,
              payment_method: params.paymentMethod ?? undefined,
            },
          },
        ],
      }),
    },
  )

  if (!response.ok) {
    const text = await response.text()
    console.error('Meta CAPI event failed', text)
  }
}
