import * as React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  PAYMENT_METHOD_CATALOG,
  calculatePaymentGatewayFee,
  type CheckoutPaymentMethod,
} from '@/lib/payment-methods'
import { formatPrice } from '@/lib/utils'

type CheckoutFormProps = {
  email: string
  name: string
  note: string
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onNoteChange: (value: string) => void
  additionalContactFields?: React.ReactNode
  purchasedProducts: React.ReactNode
  paymentDetail: React.ReactNode
  rightTopSection?: React.ReactNode
  payLabel: string
  isSubmitting: boolean
  onSubmit: React.FormEventHandler<HTMLFormElement>
  paymentMethod: CheckoutPaymentMethod
  onPaymentMethodChange: (value: CheckoutPaymentMethod) => void
  paymentOptionsName?: string
  subtotalAmount: number
}

export function CheckoutForm({
  email,
  name,
  note,
  onEmailChange,
  onNameChange,
  onNoteChange,
  additionalContactFields,
  purchasedProducts,
  paymentDetail,
  rightTopSection,
  payLabel,
  isSubmitting,
  onSubmit,
  paymentMethod,
  onPaymentMethodChange,
  paymentOptionsName = 'checkout-payment-method',
  subtotalAmount,
}: CheckoutFormProps) {
  const selectedPaymentMethod =
    PAYMENT_METHOD_CATALOG.find((option) => option.id === paymentMethod) ??
    PAYMENT_METHOD_CATALOG[0]
  const formatGatewayFeeLabel = (method: CheckoutPaymentMethod) => {
    const option = PAYMENT_METHOD_CATALOG.find((entry) => entry.id === method)
    if (!option) return ''

    const percentageLabel =
      option.gatewayFeeRule.percentBps > 0
        ? `${(option.gatewayFeeRule.percentBps / 100)
            .toFixed(2)
            .replace(/\.?0+$/, '')}%`
        : null
    if (percentageLabel) return percentageLabel
    if (option.gatewayFeeRule.fixedAmount > 0) {
      return formatPrice(option.gatewayFeeRule.fixedAmount)
    }
    return formatPrice(calculatePaymentGatewayFee(subtotalAmount, method))
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background ">
          <div className="relative max-w-6xl mx-auto px-4 py-3 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-3 text-xs text-slate-600 -ml-2 hover:bg-slate-100"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
            </Button>
            <h2 className="text-2xl font-heading">Checkout</h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              {purchasedProducts}

              <Card>
                <CardHeader>
                  <CardTitle>Contact information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-medium text-slate-600"
                      >
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-xs font-medium text-slate-600"
                      >
                        Full name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>

                  {additionalContactFields}

                  <div className="space-y-2 pt-2">
                    <Label
                      htmlFor="note"
                      className="text-xs font-medium text-slate-600"
                    >
                      Note to seller{' '}
                      <span className="text-slate-400">(optional)</span>
                    </Label>
                    <Textarea
                      id="note"
                      rows={2}
                      value={note}
                      onChange={(e) => onNoteChange(e.target.value)}
                      placeholder="Any special requests..."
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:sticky lg:top-20">
              {paymentDetail}

              {rightTopSection}

              <Card>
                <CardHeader>
                  <CardTitle>Pay With</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Label
                      htmlFor={paymentOptionsName}
                      className="text-xs font-medium text-slate-600"
                    >
                      Payment method
                    </Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) =>
                        onPaymentMethodChange(value as CheckoutPaymentMethod)
                      }
                    >
                      <SelectTrigger
                        id={paymentOptionsName}
                        className="justify-between px-3"
                      >
                        <SelectValue>
                          <div className="flex w-full items-center justify-between gap-3 text-left">
                            <span className="truncate font-medium text-slate-900">
                              {selectedPaymentMethod.title}
                            </span>
                            <span className="shrink-0 text-xs text-slate-500">
                              Fee{' '}
                              {formatGatewayFeeLabel(selectedPaymentMethod.id)}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHOD_CATALOG.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex w-full items-center justify-between gap-3">
                              <span className="truncate font-medium text-slate-900">
                                {option.title}
                              </span>
                              <span className="shrink-0 text-xs text-slate-500">
                                {formatGatewayFeeLabel(option.id)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="xl"
                className="w-full"
                loading={isSubmitting}
              >
                {payLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
