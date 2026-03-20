import Credits from './Credits'

export default function PublicProfileFooter() {
  return (
    <footer>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Credits />
        </div>
      </div>
    </footer>
  )
}
