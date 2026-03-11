import type { Editor } from "@tiptap/react"
import type { VariantProps } from "class-variance-authority"
import type { toggleVariants } from "@/components/ui/toggle"
import { useState } from "react"
import { FilePlus } from "lucide-react"
import { ToolbarButton } from "../toolbar-button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileInsertBlock } from "./file-insert-block"

interface FileInsertDialogProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

const FileInsertDialog = ({ editor, size, variant }: FileInsertDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<div />}>
        <ToolbarButton
          isActive={editor.isActive("file")}
          tooltip="Upload File"
          aria-label="Upload File"
          size={size}
          variant={variant}
        >
          <FilePlus className="size-5" />
        </ToolbarButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription className="sr-only">
            Upload files from your computer to your document
          </DialogDescription>
        </DialogHeader>
        <FileInsertBlock editor={editor} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export { FileInsertDialog }
