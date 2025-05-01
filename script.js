document.addEventListener('DOMContentLoaded', function() {
    // 為每個相簿初始化輪播功能
    const galleries = document.querySelectorAll('.floorplan-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        const prevBtn = gallery.querySelector('.gallery-control.prev');
        const nextBtn = gallery.querySelector('.gallery-control.next');
        let currentIndex = 0;

        // 隱藏所有圖片，只顯示當前圖片
        function updateGallery() {
            images.forEach((img, index) => {
                if (index === currentIndex) {
                    img.style.display = 'block';
                    img.style.opacity = '1';
                } else {
                    img.style.display = 'none';
                    img.style.opacity = '0';
                }
            });
        }

        // 初始化顯示第一張圖片
        updateGallery();

        // 上一張圖片
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery();
        });

        // 下一張圖片
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
        });

        // 自動輪播
        let autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
        }, 5000);

        // 滑鼠移入時暫停自動輪播
        gallery.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        // 滑鼠移出時恢復自動輪播
        gallery.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateGallery();
            }, 5000);
        });
    });

    // 平滑滾動功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 導航欄滾動效果
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });

    // 添加動畫效果
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature, .floorplan-card').forEach(element => {
        observer.observe(element);
    });

    // 輪播圖片功能
    const slider = document.querySelector('.hero-slider');
    const images = slider.querySelectorAll('img');
    const prevBtn = slider.querySelector('.hero-control.prev');
    const nextBtn = slider.querySelector('.hero-control.next');
    let currentIndex = 0;
    let isTransitioning = false;

    // 預加載下一張圖片
    function preloadNextImage(index) {
        const nextIndex = (index + 1) % images.length;
        const nextImage = new Image();
        nextImage.src = images[nextIndex].src;
    }

    // 顯示第一張圖片並預加載第二張
    images[0].classList.add('active');
    preloadNextImage(0);

    // 切換到指定圖片
    function switchToImage(newIndex) {
        if (isTransitioning) return;
        isTransitioning = true;

        images[currentIndex].classList.remove('active');
        images[newIndex].classList.add('active');
        currentIndex = newIndex;

        // 預加載下一張圖片
        preloadNextImage(currentIndex);

        // 防止快速切換
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }

    // 切換到上一張圖片
    function prevSlide() {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        switchToImage(newIndex);
    }

    // 切換到下一張圖片
    function nextSlide() {
        const newIndex = (currentIndex + 1) % images.length;
        switchToImage(newIndex);
    }

    // 添加按鈕事件監聽
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // 添加觸控滑動支援
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    // 自動輪播
    let autoplayInterval = setInterval(nextSlide, 5000);

    // 滑鼠移入時暫停自動輪播
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    // 滑鼠移出時恢復自動輪播
    slider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // 觸控開始時暫停自動輪播
    slider.addEventListener('touchstart', () => {
        clearInterval(autoplayInterval);
    });

    // 觸控結束時恢復自動輪播
    slider.addEventListener('touchend', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // 導航欄滾動效果
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        } else {
            nav.style.backgroundColor = 'transparent';
        }
    });

    // 建材設備表展開/收起功能
    document.querySelectorAll('.material-category h3').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.parentElement;
            category.classList.toggle('collapsed');
        });
    });

    // 初始化時收起所有建材類別
    document.querySelectorAll('.material-category').forEach(category => {
        category.classList.add('collapsed');
    });
}); 