import { Menu } from 'lucide-react'
import { useState } from 'react'
import UserButton from './user-button'
import { Button } from './ui/button'
import { SavedDrawer } from './saved-drawer'
import { LogoMark } from './kreasi-logo'


export default function SiteUserProfileHeader() {
  const [isSavedOpen, setIsSavedOpen] = useState(false)

  return (
    <>
      <header className="z-50 px-2">
        <div className="mx-auto sm:max-w-2xl md:max-w-3xl">
          <div className="flex h-16 items-center justify-between px-3">
            <LogoMark />


            <div className="flex items-center gap-3">
              <UserButton />
              <Button
                variant="outline"
                className="relative"
                onClick={() => setIsSavedOpen(true)}
              >
                <Menu className="h-4 w-4 fill-current" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <SavedDrawer open={isSavedOpen} onClose={() => setIsSavedOpen(false)} />
    </>
  )
}
