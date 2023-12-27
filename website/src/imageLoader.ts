'use client'

interface ImageLoaderArgs {
  src: string
  width: number
  height: number
}

export default function imageLoader({
  src,
  width,
  height
}: ImageLoaderArgs): string {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Image loader outside of development is not implemented')
  }
  // expect src to have leading slash
  // (with fake param args so Next.js doesn't give us a warning)
  return `${src}?width=${width}&height=${height}`
}
