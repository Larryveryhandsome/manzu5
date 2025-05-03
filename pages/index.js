import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // 加載圖片數據
    const loadImages = async () => {
      try {
        const response = await fetch('/api/images')
        const data = await response.json()
        setImages(data)
      } catch (error) {
        console.error('Error loading images:', error)
      }
    }

    loadImages()
  }, [])

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
            <div key={index} className="photo-container relative aspect-video">
              <Image
                src={image.url}
                alt={`滿築5照片${index + 1}`}
                layout="fill"
                objectFit="cover"
                priority={index < 3}
                quality={75}
                loading={index < 3 ? 'eager' : 'lazy'}
                className="rounded-lg transition-all duration-300 ease-in-out"
                onLoadingComplete={(img) => {
                  img.style.opacity = '1'
                }}
                style={{ opacity: 0 }}
              />
              <div className="loading-indicator absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg transition-opacity duration-300"
                   style={{ opacity: 0 }}>
                載入中...
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
