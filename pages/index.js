import Head from 'next/head'
import Image from 'next/image'

// 預設圖片列表
export const images = [
  { url: '/images/1.jpg', title: '滿築5-1' },
  { url: '/images/2.jpg', title: '滿築5-2' },
  { url: '/images/3.jpg', title: '滿築5-3' },
  // ... 更多圖片
]

export default function Home() {
  return (
    <div>
      <Head>
        <title>滿築5</title>
        <meta name="description" content="滿築5一站式介紹網頁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="photo-gallery grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="photo-container relative aspect-video hover:scale-105 transition-transform duration-300">
              <Image
                src={image.url}
                alt={image.title}
                width={800}
                height={600}
                priority={index < 3}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
