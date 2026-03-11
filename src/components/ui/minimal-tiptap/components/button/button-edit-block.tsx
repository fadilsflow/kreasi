import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ButtonEditorProps extends React.ComponentProps<"div"> {
  defaultText?: string
  defaultUrl?: string
  defaultVariant?: string
  defaultSize?: string
  defaultAlignment?: string
  onSave: (payload: { text: string; url: string; variant: string; size: string; alignment: string }) => void
}

export const ButtonEditBlock = ({
  onSave,
  defaultText,
  defaultUrl,
  defaultVariant,
  defaultSize,
  defaultAlignment,
  className,
}: ButtonEditorProps) => {
  const formRef = React.useRef<HTMLDivElement>(null)
  const [text, setText] = React.useState(defaultText || "Click Me")
  const [url, setUrl] = React.useState(defaultUrl || "")
  const [variant, setVariant] = React.useState(defaultVariant || "default")
  const [size, setSize] = React.useState(defaultSize || "default")
  const [alignment, setAlignment] = React.useState(defaultAlignment || "left")

  const handleSave = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (formRef.current) {
        const isValid = Array.from(
          formRef.current.querySelectorAll("input")
        ).every((input) => input.checkValidity())

        if (isValid) {
          onSave({ text, url, variant, size, alignment })
        } else {
          formRef.current.querySelectorAll("input").forEach((input) => {
            if (!input.checkValidity()) {
              input.reportValidity()
            }
          })
        }
      }
    },
    [onSave, text, url, variant, size, alignment]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleSave(event)
      }
    },
    [handleSave]
  )

  return (
    <div ref={formRef} onKeyDown={handleKeyDown}>
      <div className={cn("space-y-4", className)}>
        <div className="space-y-1">
          <Label>Label</Label>
          <Input
            type="text"
            required
            placeholder="Click Me"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label>URL</Label>
          <Input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Variant</Label>
            <select
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:border-ring"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
              <option value="destructive">Destructive</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label>Size</Label>
            <select
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:border-ring"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="sm">Small</option>
              <option value="default">Default</option>
              <option value="lg">Large</option>
              <option value="xl">XL</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Alignment</Label>
          <select
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:border-ring"
            value={alignment}
            onChange={(e) => setAlignment(e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

ButtonEditBlock.displayName = "ButtonEditBlock"

export default ButtonEditBlock
