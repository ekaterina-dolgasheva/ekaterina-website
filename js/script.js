document.addEventListener('DOMContentLoaded', () => {
    // Set current year in copyright
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    const currentUrl = window.location.href;
    let newUrl = currentUrl;

    if (currentUrl.endsWith('index.html')) {
        newUrl = currentUrl.slice(0, -10) || '/';
    }

    history.replaceState(null, '', newUrl);

    // Loader optimization: wait for both animation and window load
    const loader = document.getElementById('loader');
    const firstVisitTimestamp = localStorage.getItem('firstVisitTimestamp');
    const currentTime = new Date().getTime();
    const fiveMinutes = 300000;

    if (loader) {
        if (!firstVisitTimestamp || (currentTime - firstVisitTimestamp) > fiveMinutes) {
            localStorage.setItem('firstVisitTimestamp', currentTime);

            let animationDone = false;
            let pageLoaded = false;

            function hideLoader() {
                if (animationDone && pageLoaded) {
                    loader.classList.add('hidden');
                }
            }

            setTimeout(() => {
                animationDone = true;
                hideLoader();
            }, 1400);

            window.addEventListener('load', () => {
                pageLoaded = true;
                hideLoader();
            });
        } else {
            loader.style.display = 'none';
        }
    }

    // Custom lightweight parallax via background-position (replaces Rellax CDN)
    const rellaxElements = document.querySelectorAll('.rellax');
    let parallaxEnabled = true;
    let parallaxTicking = false;
    const visibleElements = new Set();

    if (rellaxElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleElements.add(entry.target);
                } else {
                    visibleElements.delete(entry.target);
                }
            });
        }, { rootMargin: '200px' });

        rellaxElements.forEach(el => observer.observe(el));

        function updateParallax() {
            if (!parallaxEnabled) return;
            visibleElements.forEach(el => {
                const speed = parseFloat(el.dataset.rellaxSpeed) || -2;
                const rect = el.getBoundingClientRect();
                // Shift background-position based on element's viewport position
                const offset = rect.top * speed * 0.05;
                el.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
            });
            parallaxTicking = false;
        }

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!parallaxTicking && parallaxEnabled) {
                parallaxTicking = true;
                rellaxElements.forEach(el => { el.style.willChange = 'background-position'; });
                requestAnimationFrame(updateParallax);
            }
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                rellaxElements.forEach(el => { el.style.willChange = ''; });
            }, 200);
        }, { passive: true });

        updateParallax();
    }

    function disableRellax() {
        parallaxEnabled = false;
    }

    function enableRellax() {
        parallaxEnabled = true;
    }

    const closeBtns = document.querySelectorAll('.close');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            enableScroll();
            enableRellax();
        });
    });

    // Gallery lightbox with picture/source support
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-label', 'Visualizzazione immagine ingrandita');
            document.body.appendChild(lightbox);

            const img = document.createElement('img');
            img.src = image.currentSrc || image.src;
            img.alt = image.alt || 'Immagine ingrandita';
            lightbox.appendChild(img);

            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close');
            closeBtn.setAttribute('role', 'button');
            closeBtn.setAttribute('aria-label', 'Chiudi');
            closeBtn.innerHTML = '&times;';
            lightbox.appendChild(closeBtn);

            disableScroll();
            disableRellax();

            closeBtn.addEventListener('click', () => {
                lightbox.remove();
                enableScroll();
                enableRellax();
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.remove();
                    enableScroll();
                    enableRellax();
                }
            });
        });
    });

    function disableScroll() {
        const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}`;
        document.body.style.width = '100%';
    }

    function enableScroll() {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    window.addEventListener('scroll', () => {
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                scrollToTarget(targetElement);
            }
        });
    });

    function scrollToTarget(targetElement) {
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    const videos = document.querySelectorAll('.video');
    const modal = document.getElementById('lightbox');
    const videoFrame = document.getElementById('video-frame');
    const closeBtn = document.querySelector('.close-video');

    if (closeBtn) {
        videos.forEach(video => {
            video.addEventListener('click', function (event) {
                event.preventDefault();
                const videoUrl = video.getAttribute('href');
                const embedUrl = videoUrl.replace("watch?v=", "embed/");
                videoFrame.src = embedUrl;
                modal.style.display = "block";
            });
        });

        closeBtn.addEventListener('click', function () {
            modal.style.display = "none";
            videoFrame.src = "";
        });

        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
                videoFrame.src = "";
            }
        });
    }
});
