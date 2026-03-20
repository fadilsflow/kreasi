import * as React from 'react'

declare global {
  interface Window {
    fbq?: (...args: Array<any>) => void
    _fbq?: (...args: Array<any>) => void
  }
}

export function MetaPixel({ pixelId }: { pixelId?: string | null }) {
  React.useEffect(() => {
    if (!pixelId || typeof window === 'undefined') return
    if (window.fbq) {
      window.fbq('init', pixelId)
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'

    const fbqShim = function (...args: Array<any>) {
      ;(fbqShim as any).callMethod
        ? (fbqShim as any).callMethod.apply(fbqShim, args)
        : (fbqShim as any).queue.push(args)
    }

    ;(fbqShim as any).queue = []
    ;(fbqShim as any).loaded = true
    ;(fbqShim as any).version = '2.0'

    window.fbq = fbqShim
    window._fbq = fbqShim

    document.head.appendChild(script)
    window.fbq('init', pixelId)
  }, [pixelId])

  return null
}

export function trackMetaPixelEvent(
  eventName: string,
  payload?: Record<string, unknown>,
  eventId?: string,
) {
  if (typeof window === 'undefined' || !window.fbq) return

  if (eventId) {
    window.fbq('track', eventName, payload ?? {}, {
      eventID: eventId,
    })
    return
  }

  window.fbq('track', eventName, payload ?? {})
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))

  if (!cookie) return null
  return decodeURIComponent(cookie.slice(name.length + 1))
}

export function getMetaAttributionData(): {
  fbp?: string
  fbc?: string
  sourceUrl?: string
} {
  if (typeof window === 'undefined') return {}

  const fbp = readCookie('_fbp') ?? undefined
  const cookieFbc = readCookie('_fbc') ?? undefined
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  const fbc = cookieFbc ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined)

  return {
    fbp,
    fbc,
    sourceUrl: window.location.href,
  }
}

const META_PENDING_PURCHASE_KEY = 'meta_pending_purchase'

type PendingMetaPurchase = {
  orderId: string
  eventId: string
  contentIds: Array<string>
  contentName: string
  currency: string
  value: number
}

export function savePendingMetaPurchase(payload: PendingMetaPurchase) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(
    META_PENDING_PURCHASE_KEY,
    JSON.stringify(payload),
  )
}

export function consumePendingMetaPurchase(
  orderId: string,
): PendingMetaPurchase | null {
  if (typeof window === 'undefined') return null

  const raw = window.sessionStorage.getItem(META_PENDING_PURCHASE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as PendingMetaPurchase
    if (parsed.orderId !== orderId) return null
    window.sessionStorage.removeItem(META_PENDING_PURCHASE_KEY)
    return parsed
  } catch {
    window.sessionStorage.removeItem(META_PENDING_PURCHASE_KEY)
    return null
  }
}

export function createMetaEventId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}
