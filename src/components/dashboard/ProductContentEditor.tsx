import * as React from 'react'
import type { Content } from '@tiptap/react'
import { Upload, Video } from 'lucide-react'
import { MainMinimalTiptapEditor } from '@/components/ui/minimal-tiptap'
import { useMinimalTiptapEditor } from '@/components/ui/minimal-tiptap/hooks/use-minimal-tiptap'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toastManager } from '@/components/ui/toast'
import { uploadFile } from '@/lib/upload-client'
import { cn } from '@/lib/utils'

export interface ProductContentEditorProps {
  value?: Content | null
  onChange: (value: Content) => void
  onUploadingChange?: (isUploading: boolean) => void
  className?: string
}

function normalizeFileUploadError(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Could not upload files. Please try again.'
}

function isValidEmbedUrl(raw: string) {
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function ProductContentEditor({
  value,
  onChange,
  onUploadingChange,
  className,
}: ProductContentEditorProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const setUploading = (next: boolean) => {
    setIsUploading(next)
    onUploadingChange?.(next)
  }

  const editor = useMinimalTiptapEditor({
    value: value ?? undefined,
    output: 'json',
    placeholder: 'Compose the content your buyer will receive after checkout…',
    onUpdate: (content) => onChange(content),
    uploader: async (file) => {
      setUploading(true)
      try {
        return await uploadFile(file, 'products/content-images')
      } finally {
        setUploading(false)
      }
    },
  })

  const insertDownloadLink = React.useCallback(
    (name: string, url: string) => {
      if (!editor) return
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `Download ${name}`,
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: url,
                    target: '_blank',
                    rel: 'noreferrer',
                  },
                },
              ],
            },
          ],
        })
        .run()
    },
    [editor],
  )

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    setUploading(true)

    try {
      for (const file of files) {
        const url = await uploadFile(file, 'products/content-files')
        insertDownloadLink(file.name, url)
      }
    } catch (error) {
      toastManager.add({
        title: 'Upload failed',
        description: normalizeFileUploadError(error),
        type: 'error',
      })
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleEmbedInsert = () => {
    if (!editor) return
    const raw = window.prompt('Paste an embed URL (YouTube, Vimeo, Loom, etc.)')
    if (!raw) return

    if (!isValidEmbedUrl(raw)) {
      toastManager.add({
        title: 'Invalid embed URL',
        description: 'Use a valid http(s) URL for embeds.',
        type: 'error',
      })
      return
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'embed',
        attrs: {
          src: raw,
          title: 'Embedded content',
        },
      })
      .run()
  }

  if (!editor) return null

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label className="text-sm font-medium">Delivery content</Label>
          <p className="text-xs text-muted-foreground">
            Build the exact content buyers see after checkout.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload file
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEmbedInsert}
          >
            <Video className="h-4 w-4" />
            Embed video
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <MainMinimalTiptapEditor
        editor={editor}
        className="min-h-[420px]"
        editorContentClassName="p-4"
      />
    </div>
  )
}

export default ProductContentEditor
