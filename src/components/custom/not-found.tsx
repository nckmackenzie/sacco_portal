import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative mb-8 inline-block w-full">
          <div className="absolute left-0 top-1/2 h-px w-16 bg-background md:w-24"></div>
          <div className="absolute right-0 top-1/2 h-px w-16 bg-background md:w-24"></div>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="relative">
            <span className="absolute -left-16 top-1/2 -translate-y-1/2 rounded bg-pink-500 px-2 py-0.5 text-xs font-medium text-white">
              ERROR 404
            </span>
            <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              PAGE NOT FOUND
            </h1>
          </div>
        </div>

        <p className="mx-auto mb-10 max-w-md text-center text-base text-muted-foreground">
          The page you were looking for could not be found. It might have been
          removed, renamed, or did not exist in the first place.
        </p>

        <Button asChild size="lg">
          <Link
            to="/dashboard"
            //   className="inline-flex h-12 items-center justify-center rounded-none bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            GO TO HOME PAGE
          </Link>
        </Button>

        <div className="relative mt-8 inline-block w-full">
          <div className="absolute left-0 top-1/2 h-px w-16 bg-gray-300 md:w-24"></div>
          <div className="absolute right-0 top-1/2 h-px w-16 bg-gray-300 md:w-24"></div>
        </div>
      </div>
    </div>
  )
}
