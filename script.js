document.addEventListener('DOMContentLoaded', function() {
    // 圖片載入管理
    const imageManager = {
        loadQueue: new Set(),
        preloadQueue: new Set(),
        observer: null,
        preloadImage: function(src) {
            if (!this.preloadQueue.has(src)) {
                this.preloadQueue.add(src);
                const img = new Image();
                img.onload = () => this.preloadQueue.delete(src);
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
                                this.loadQueue.add(img.dataset.src);
                                img.onload = () => {
                                    img.style.display = 'block';
                                    this.loadQueue.delete(img.dataset.src);
                                };
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            observer.unobserve(img);
                        }
                    });
                },
                {
                    rootMargin: '100px 0px',
                    threshold: 0.1
                }
            );
        }
    };
    
    imageManager.init();

    // 為每個相簿初始化輪播功能
    const galleries = document.querySelectorAll('.floorplan-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        const prevBtn = gallery.querySelector('.gallery-control.prev');
        const nextBtn = gallery.querySelector('.gallery-control.next');
        let currentIndex = 0;

        // 初始化懶加載
        images.forEach(img => {
            imageManager.observer.observe(img);
        });

        // 更新圖片顯示狀態並預加載下一張
        function updateGallery() {
            images.forEach((img, index) => {
                if (index === currentIndex) {
                    img.style.display = 'block';
                    img.style.opacity = '1';
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    // 預加載下一張圖片
                    const nextIndex = (index + 1) % images.length;
                    const nextImg = images[nextIndex];
                    if (nextImg.dataset.src) {
                        imageManager.preloadImage(nextImg.dataset.src);
                    }
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

    // 優化的預加載函數
    const preloadQueue = new Set();
    function preloadNextImage(index) {
        const nextIndex = (index + 1) % images.length;
        const nextImage = images[nextIndex];
        
        if (nextImage.dataset.src && !preloadQueue.has(nextImage.dataset.src)) {
            preloadQueue.add(nextImage.dataset.src);
            const img = new Image();
            img.onload = () => {
                nextImage.src = nextImage.dataset.src;
                nextImage.removeAttribute('data-src');
                preloadQueue.delete(nextImage.dataset.src);
            };
            img.src = nextImage.dataset.src;
        }
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

    // 房型資料
    const floorplanData = {
        townhouse: {
            title: '透天美墅',
            subtitle: '冬山｜全新落成｜閑靜透天',
            images: [
                ...Array.from({length: 28}, (_, i) => `透天/pic/1 (${i + 1}).jpg`)
            ],
            info: {
                '格局': '四層透天',
                '車位': '門前停車',
                '價格': '1,320萬',
                '建坪': '約46坪',
                '地坪': '約23坪'
            },
            layout: {
                '一樓': '門廳、客廳、餐廳、廚房、衛浴',
                '二樓': '主臥室(含衛浴)、次臥室',
                '三樓': '家庭室、臥室、衛浴',
                '四樓': '屋突、露台'
            },
            features: {
                title: '特色說明',
                description: '✨ 方正客廳，空間感十足\n☀️ 全棟採光通風良好\n🚗 門前車位設計，停車方便\n🌅 頂樓露台，視野遼闊\n🏢 近羅東市區生活圈'
            }
        },
        b2: {
            title: 'B2 房型',
            images: [
                'B2/B2 (1).jpg',
                'B2/B2 (2).jpg',
                'B2/B2 (3).jpg',
                'B2/B2 (4).jpg',
                'B2/B2 (5).jpg',
                'B2/B2 (6).jpg',
                'B2/B2 (7).jpg',
                'B2/B2 (8).jpg',
                'B2/B2 (9).jpg',
                'B2/B2 (10).jpg',
                'B2/B2 (11).jpg',
                'B2/B2 (12).jpg',
                'B2/B2 (13).jpg',
                'B2/B2 (14).jpg',
                'B2/B2 (15).jpg'
            ],
            info: {
                '格局': '兩房兩廳一衛',
                '車位': '平面車位',
                '價格': '728萬',
                '樓層': '2樓',
                '建坪': '30.91坪',
                '主建物': '17.39坪',
                '附屬建物': '2.59坪',
                '共用部分': '10.93坪',
                '地坪': '5.10坪'
            },
            features: {
                title: '特色說明',
                description: '便利性及機動性兼具，搬運物品方便。二樓位置適中，採光通風良好，居住舒適度高。'
            }
        },
        b10: {
            title: 'B10 房型',
            images: [
                'B10/B10 (1).jpg',
                'B10/B10 (2).jpg',
                'B10/B10 (3).jpg',
                'B10/B10 (4).jpg',
                'B10/B10 (5).jpg',
                'B10/B10 (6).jpg',
                'B10/B10 (7).jpg',
                'B10/B10 (8).jpg',
                'B10/B10 (9).jpg',
                'B10/B10 (10).jpg',
                'B10/B10 (11).jpg',
                'B10/B10 (12).jpg'
            ],
            info: {
                '格局': '兩房兩廳一衛',
                '車位': '平面車位',
                '價格': '688萬',
                '樓層': '2樓',
                '建坪': '30.81坪',
                '主建物': '17.44坪',
                '附屬建物': '2.48坪',
                '共用部分': '10.90坪',
                '地坪': '5.10坪'
            },
            features: {
                title: '特色說明',
                description: '位於二樓的實用戶型，採光通風良好，空間規劃合理。適合小家庭或首購族群，性價比高。'
            }
        },
        c6: {
            title: 'C6 房型',
            images: [
                'C6/C6 (1).jpg',
                'C6/C6 (2).jpg',
                'C6/C6 (3).jpg',
                'C6/C6 (4).jpg',
                'C6/C6 (5).jpg',
                'C6/C6 (6).jpg',
                'C6/C6 (7).jpg',
                'C6/C6 (8).jpg',
                'C6/C6 (9).jpg',
                'C6/C6 (10).jpg',
                'C6/C6 (11).jpg',
                'C6/C6 (12).jpg',
                'C6/C6 (13).jpg'
            ],
            info: {
                '格局': '兩房兩廳一衛',
                '車位': '平面車位',
                '價格': '738萬',
                '樓層': '3樓',
                '建坪': '31.55坪',
                '主建物': '17.56坪',
                '附屬建物': '2.83坪',
                '共用部分': '11.16坪',
                '地坪': '5.22坪'
            },
            features: {
                title: '特色說明',
                description: '三樓位置優越，視野開闊，採光充足。戶型方正，空間規劃靈活，適合追求生活品質的小家庭。'
            }
        },
        c10: {
            title: 'C10 房型',
            images: [
                'C10/C10 (1).jpg',
                'C10/C10 (2).jpg',
                'C10/C10 (3).jpg',
                'C10/C10 (4).jpg',
                'C10/C10 (5).jpg',
                'C10/C10 (6).jpg',
                'C10/C10 (7).jpg',
                'C10/C10 (8).jpg',
                'C10/C10 (9).jpg',
                'C10/C10 (10).jpg',
                'C10/C10 (11).jpg'
            ],
            info: {
                '格局': '兩房兩廳一衛',
                '車位': '平面車位',
                '價格': '698萬',
                '樓層': '3樓',
                '建坪': '30.81坪',
                '主建物': '17.44坪',
                '附屬建物': '2.48坪',
                '共用部分': '10.90坪',
                '地坪': '5.10坪'
            },
            features: {
                title: '特色說明',
                description: '三樓位置優越，視野開闊，採光充足。戶型方正，空間規劃合理，性價比高，適合首購族或小家庭。'
            }
        },
        d6: {
            title: 'D6 房型',
            images: [
                'D6/D6 (1).jpg',
                'D6/D6 (2).jpg',
                'D6/D6 (3).jpg',
                'D6/D6 (4).jpg',
                'D6/D6 (5).jpg',
                'D6/D6 (6).jpg',
                'D6/D6 (7).jpg',
                'D6/D6 (8).jpg',
                'D6/D6 (9).jpg',
                'D6/D6 (10).jpg',
                'D6/D6 (11).jpg',
                'D6/D6 (12).jpg',
                'D6/D6 (13).jpg',
                'D6/D6 (14).jpg',
                'D6/D6 (15).jpg'
            ],
            info: {
                '格局': '兩房兩廳一衛',
                '車位': '平面車位',
                '價格': '758萬',
                '樓層': '4樓',
                '建坪': '31.55坪',
                '主建物': '17.56坪',
                '附屬建物': '2.83坪',
                '共用部分': '11.16坪',
                '地坪': '5.22坪'
            },
            features: {
                title: '特色說明',
                description: '四樓高樓層，視野遼闊，採光充足。戶型方正，空間規劃完善，適合追求優質居住環境的家庭。'
            }
        },
        d8: {
            title: 'D8 房型',
            images: [
                'D8/D8 (1).jpg',
                'D8/D8 (2).jpg',
                'D8/D8 (3).jpg',
                'D8/D8 (4).jpg',
                'D8/D8 (5).jpg',
                'D8/D8 (6).jpg',
                'D8/D8 (7).jpg',
                'D8/D8 (8).jpg',
                'D8/D8 (9).jpg',
                'D8/D8 (10).jpg',
                'D8/D8 (11).jpg',
                'D8/D8 (12).jpg',
                'D8/D8 (13).jpg',
                'D8/D8 (14).jpg',
                'D8/D8 (15).jpg'
            ],
            info: {
                '格局': '兩房兩廳一衛',
                '車位': '平面車位',
                '價格': '733萬',
                '樓層': '4樓',
                '建坪': '29.34坪',
                '主建物': '16.93坪',
                '附屬建物': '2.03坪',
                '共用部分': '10.38坪',
                '地坪': '5.10坪'
            },
            features: {
                title: '特色說明',
                description: '四樓高樓層，視野遼闊，採光充足。戶型方正，空間規劃完善，性價比優異，適合追求優質生活的家庭。'
            }
        }
    };

    // 浮動視窗功能
    const modal = document.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalPhotoShowcase = modal.querySelector('.modal-photo-showcase');
    const modalInfoGrid = modal.querySelector('.modal-info-grid');
    const modalFeatures = modal.querySelector('.modal-features');
    let currentPhotoIndex = 0;
    let currentFloorplanType = '';

    // 關閉浮動視窗
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // 點擊外部關閉浮動視窗
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 照片輪播控制
    const modalPrevBtn = modal.querySelector('.modal-photo-control.prev');
    const modalNextBtn = modal.querySelector('.modal-photo-control.next');

    modalPrevBtn.addEventListener('click', () => {
        showModalPhoto('prev');
    });

    modalNextBtn.addEventListener('click', () => {
        showModalPhoto('next');
    });

    // 顯示照片
    function showModalPhoto(direction) {
        const photos = modalPhotoShowcase.querySelectorAll('img');
        photos[currentPhotoIndex].classList.remove('active');

        if (direction === 'next') {
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        } else {
            currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        }

        photos[currentPhotoIndex].classList.add('active');
    }

    // 開啟浮動視窗
    document.querySelectorAll('.floorplan-card').forEach(card => {
        const detailsBtn = card.querySelector('.details-link');
        detailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = card.dataset.type;
            currentFloorplanType = type;
            openModal(type);
        });
    });

    function openModal(type) {
        const data = floorplanData[type];
        
        // 設置標題
        modal.querySelector('.modal-header h2').textContent = data.title;

        // 載入照片，使用縮圖預覽
        modalPhotoShowcase.innerHTML = data.images.map((src, index) => {
            // 生成縮圖URL (假設縮圖在 thumbnails 子目錄)
            const thumbSrc = src.replace(/(\/[^\/]+)$/, '/thumbnails$1');
            return `
                <img 
                    data-src="${src}" 
                    src="${thumbSrc}" 
                    alt="${data.title}照片${index + 1}" 
                    class="${index === 0 ? 'active' : ''}" 
                    loading="lazy"
                    style="filter: blur(0px); transition: filter 0.3s ease-out;"
                    onload="this.style.filter = 'blur(0px)';"
                >`;
        }).join('') + modalPhotoShowcase.querySelector('.modal-photo-controls').outerHTML;

        // 預加載第一張高清圖片
        const firstImg = modalPhotoShowcase.querySelector('img');
        if (firstImg) {
            imageManager.preloadImage(firstImg.dataset.src);
        }

        // 使用 IntersectionObserver 懶加載模態框圖片
        const modalImages = modalPhotoShowcase.querySelectorAll('img');
        modalImages.forEach(img => {
            imageManager.observer.observe(img);
        });

        // 載入基本資訊
        modalInfoGrid.innerHTML = Object.entries(data.info).map(([label, value]) => `
            <div class="modal-info-item">
                <div class="modal-info-label">${label}</div>
                <div class="modal-info-value">${value}</div>
            </div>
        `).join('');

        // 載入特色說明
        modalFeatures.innerHTML = `
            <h3>${data.features.title}</h3>
            <p>${data.features.description}</p>
        `;

        currentPhotoIndex = 0;
        modal.classList.add('active');
    }

    window.openModal = openModal;
    window.closeModal = function() {
        document.querySelector('.modal-overlay').classList.remove('active');
    };
}); 