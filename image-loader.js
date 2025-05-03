export default function imageLoader({ src, width, quality }) {
  // 如果是外部圖片 URL，直接返回
  if (src.startsWith('http')) {
    return src
  }
  // 否則，加上基本路徑
  return `/manzu5${src}`
}
