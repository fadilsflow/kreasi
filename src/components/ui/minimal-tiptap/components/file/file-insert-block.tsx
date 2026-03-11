import * as React from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"

interface FileInsertBlockProps {
  editor: Editor
  close: () => void
}

export const FileInsertBlock: React.FC<FileInsertBlockProps> = ({
  editor,
  close,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return

      for (const file of Array.from(files)) {
         const blobUrl = URL.createObjectURL(file)
         editor
           .chain()
           .focus()
           .insertContent({
             type: 'file',
             attrs: {
               url: blobUrl,
               name: file.name,
               type: file.type || file.name.split('.').pop() || '',
               size: file.size,
             },
           })
           .run()
      }
      close()
    },
    [editor, close]
  )

  return (
    <div className="space-y-4">
      <Button type="button" className="w-full font-medium" onClick={() => fileInputRef.current?.click()}>
        Upload files from your computer
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

export default FileInsertBlock
