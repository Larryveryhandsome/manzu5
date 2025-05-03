import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <Head>
        <title>滿築5</title>
        <meta name="description" content="滿築5一站式介紹網頁" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* 將原始的 HTML 內容移到這裡，並使用 Next.js Image 組件 */}
        <div className="photo-container">
          {/* 使用 Next.js Image 組件替換原始的 img 標籤 */}
          <Image
            src="/images/example.jpg"
            alt="示例圖片"
            width={1200}
            height={800}
            priority={true}
            quality={75}
          />
        </div>
      </main>
    </div>
  )
}
