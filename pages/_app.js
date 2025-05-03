import { useEffect } from 'react'
import '../styles.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // 移動原始的 script.js 邏輯到這裡
    const imageManager = {
      loadQueue: new Set(),
      preloadQueue: new Set(),
      observer: null,
      isMobile: typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      
      preloadImage: function(src) {
        if (!this.preloadQueue.has(src)) {
          this.preloadQueue.add(src);
          const img = new Image();
          img.onload = () => {
            this.preloadQueue.delete(src);
            const loadingIndicator = document.querySelector(`[data-loading-for="${src}"]`);
            if (loadingIndicator) {
              loadingIndicator.style.display = 'none';
            }
          };
          img.src = src;
        }
      },
      
      init: function() {
        this.observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src && !this.loadQueue.has(img.dataset.src)) {
                  const container = img.parentElement;
                  let loadingIndicator = container.querySelector('.loading-indicator');
                  if (!loadingIndicator) {
                    loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator';
                    loadingIndicator.innerHTML = '載入中...';
                    loadingIndicator.setAttribute('data-loading-for', img.dataset.src);
                    container.appendChild(loadingIndicator);
                  }
                  
                  this.loadQueue.add(img.dataset.src);
                  img.onload = () => {
                    img.style.display = 'block';
                    this.loadQueue.delete(img.dataset.src);
                    loadingIndicator.style.display = 'none';
                  };
                  img.src = img.dataset.src;
                  img.removeAttribute('data-src');
                }
                observer.unobserve(img);
              }
            });
          },
          {
            rootMargin: '150px 0px',
            threshold: 0.1
          }
        );
      }
    };
    
    imageManager.init();
  }, []);

  return <Component {...pageProps} />
}

export default MyApp
