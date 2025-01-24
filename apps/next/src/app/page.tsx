import Image from 'next/image'
import { ClientTracking } from '@/components/client-tracking'
import { identify } from '@byteslice/events/server'

export default function Home() {
  identify('development@byteslice.co')

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="mx-auto"
          src="/logo.png"
          alt="ByteSlice logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by checking out the packages in{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              packages/
            </code>
            .
          </li>
          <li>Import a package in this app to use it.</li>
        </ol>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <ClientTracking />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://byteslice.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by ByteSlice
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/next.svg"
            alt="Next.js Logo"
            width={100}
            height={20}
          />
        </a>
      </footer>
    </div>
  )
}
