import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FileEditBlockProps extends React.ComponentProps<"div"> {
  defaultName?: string
  defaultDescription?: string
  onSave: (payload: { name: string; description: string }) => void
}

export const FileEditBlock = ({
  defaultName,
  defaultDescription,
  onSave,
  className,
}: FileEditBlockProps) => {
  const formRef = React.useRef<HTMLDivElement>(null)
  const [name, setName] = React.useState(defaultName || "")
  const [description, setDescription] = React.useState(defaultDescription || "")

  const handleSave = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (formRef.current) {
        const isValid = Array.from(
          formRef.current.querySelectorAll("input")
        ).every((input) => input.checkValidity())

        if (isValid) {
          onSave({ name, description })
        } else {
          formRef.current.querySelectorAll("input").forEach((input) => {
            if (!input.checkValidity()) {
              input.reportValidity()
            }
          })
        }
      }
    },
    [description, name, onSave]
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
          <Label>Name</Label>
          <Input
            required
            placeholder="File name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label>Description (optional)</Label>
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

FileEditBlock.displayName = "FileEditBlock"

export default FileEditBlock
