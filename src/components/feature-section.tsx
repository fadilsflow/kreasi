import { Frame, FramePanel } from './ui/frame'

export default function FeatureSection() {
  return (
    <>
      <div className="container">
        <Frame className=" relative mt-3 border bg-background">
          <FramePanel className="p-10">
            <div className="gap-4 ">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading ">
                Fee hanya 3%
              </h2>
              <p className="mt-4  max-w-2xl text-xl  text-foreground/80">
                Nikmati 97% tip langsung ke saldo kamu. Terendah, paling
                kompetitif di Industri.
              </p>
            </div>
            <img
              src="https://tiptap.gg/_next/static/media/peep-sitting-6.img.8974f727.svg"
              alt="images"
              width={300}
              height={300}
              className="hidden md:block absolute right-0 -top-10 aspect-square transform -scale-x-100"
            />
          </FramePanel>
        </Frame>
      </div>
    </>
  )
}
