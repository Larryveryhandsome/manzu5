// pages/api/images.js
export default function handler(req, res) {
  // 返回圖片列表
  const images = [
    // 這裡應該是你的圖片列表
    { url: '/images/1.jpg' },
    { url: '/images/2.jpg' },
    { url: '/images/3.jpg' },
    // ... 更多圖片
  ]

  res.status(200).json(images)
}
