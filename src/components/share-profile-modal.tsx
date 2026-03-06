import { Share } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { XformerlyTwitter } from './icon/x'
import { Facebook } from './icon/facebook'
import { LinkedIn } from './icon/linkedin'
import { WhatsApp } from './icon/whatsapp'
import { Gmail } from './icon/gmail'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

export function ShareProfileModal({
  url,
  children,
}: {
  url: string
  children?: React.ReactElement
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus('copied')
      setTimeout(() => {
        setCopyStatus('idle')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const platform = [
    {
      name: 'WhatsApp',
      icon: <WhatsApp className="h-6 w-6" />,
      color: 'bg-[#25D366] text-white hover:bg-[#25D366]/90',
      url: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      name: 'X',
      icon: <XformerlyTwitter className="h-5 w-5" />,
      color: 'bg-black text-white',
      url: `https://x.com/intent/tweet?text=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-6 w-6" />,
      color: 'bg-[#1877F2] text-white hover:bg-[#1877F2]/90',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn className="h-6 w-6" />,
      color: 'bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Gmail',
      icon: <Gmail className="h-6 w-6" />,
      color: 'bg-[#EA4335] text-white hover:bg-[#EA4335]/90',
      url: `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=&su=Check out my profile&body=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <Popover>
      <PopoverTrigger
        render={
          children || (
            <Button
              className="py-6 px-6 font-semibold"
              variant={'outline'}
              size={'lg'}
            />
          )
        }
      >
        {!children && (
          <>
            <span className="truncate max-w-[120px] md:max-w-40">
              {url.replace(/^https?:\/\//, '')}
            </span>
            <Share className="ml-2 h-4 w-4" />
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(92vw,28rem)] border-none p-0 shadow-2xl"
        align="end"
      >
        <div className="space-y-8 p-4">
          <PopoverTitle className="text-xl font-heading font-bold">
            Share
          </PopoverTitle>

          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              {platform.map((p) => (
                <Link
                  key={p.name}
                  to={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 outline-none"
                >
                  <div
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-2xl border',
                      p.color,
                    )}
                  >
                    {p.icon}
                  </div>
                  <span className="text-[11px]">{p.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <InputGroup className="px-0.5 py-1">
            <InputGroupInput
              readOnly
              value={url.replace(/^https?:\/\//, '')}
              className="text-sm font-medium"
            />
            <InputGroupAddon align="inline-end">
              <Button size="sm" className="rounded-full" onClick={handleCopyLink}>
                {copyStatus === 'copied' ? 'Copied' : 'Copy'}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}
