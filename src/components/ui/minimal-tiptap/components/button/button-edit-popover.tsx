import * as React from "react"
import type { Editor } from "@tiptap/react"
import type { VariantProps } from "class-variance-authority"
import type { toggleVariants } from "@/components/ui/toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BoxIcon } from "lucide-react"
import { ToolbarButton } from "../toolbar-button"
import { ButtonEditBlock } from "./button-edit-block"

interface ButtonEditPopoverProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

const ButtonEditPopover = ({ editor, size, variant }: ButtonEditPopoverProps) => {
  const [open, setOpen] = React.useState(false)

  const { from, to } = editor.state.selection
  const text = editor.state.doc.textBetween(from, to, " ")

  const onSetButton = React.useCallback(
    (payload: { text: string; url: string; variant: string; size: string; alignment: string }) => {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "button",
          attrs: payload,
        })
        .run()

      setOpen(false)
    },
    [editor]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<div />}>
        <ToolbarButton
          isActive={editor.isActive("button")}
          tooltip="Button"
          aria-label="Insert button"
          disabled={editor.isActive("codeBlock")}
          size={size}
          variant={variant}
        >
          <BoxIcon className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-80">
        <ButtonEditBlock onSave={onSetButton} defaultText={text || "Click Me"} />
      </PopoverContent>
    </Popover>
  )
}

export { ButtonEditPopover }
