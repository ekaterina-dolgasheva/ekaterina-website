document.addEventListener('DOMContentLoaded', () => {
    // --- Cookie Consent & GA4 (Google Consent Mode v2) ---
    var GA4_ID = 'G-QF3X2SKS9L';
    var CONSENT_KEY = 'cookie-consent';
    var CONSENT_MAX_AGE = 15552000000; // 6 mesi in ms

    // Inizializza gtag in denied mode (prima di caricare GA4)
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'default', {
        analytics_storage: 'denied'
    });

    // Carica lo script GA4 subito (in denied mode, non traccia nulla)
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(gaScript);
    gtag('js', new Date());
    gtag('config', GA4_ID);

    function getConsent() {
        try {
            var data = JSON.parse(localStorage.getItem(CONSENT_KEY));
            if (data && (Date.now() - data.t < CONSENT_MAX_AGE)) return data;
        } catch (e) {}
        localStorage.removeItem(CONSENT_KEY);
        return null;
    }

    function saveConsent(analytics) {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            analytics: analytics,
            t: Date.now()
        }));
        gtag('consent', 'update', {
            analytics_storage: analytics ? 'granted' : 'denied'
        });
        hideBanner();
        updateRevokeButton();
    }

    function showBanner() {
        var banner = document.getElementById('cookie-banner');
        var overlay = document.getElementById('cb-overlay');
        if (banner) banner.style.display = 'block';
        if (overlay) overlay.style.display = 'block';
    }

    function hideBanner() {
        var banner = document.getElementById('cookie-banner');
        var overlay = document.getElementById('cb-overlay');
        if (banner) banner.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    }

    function showPrefsModal() {
        var modal = document.getElementById('cookie-prefs-modal');
        if (!modal) return;
        var toggle = document.getElementById('cb-analytics-toggle');
        if (toggle) toggle.checked = false; // sempre off di default
        modal.style.display = 'flex';
        hideBanner();
        // Focus trap: focus sul dialog
        var dialog = modal.querySelector('.cp-dialog');
        if (dialog) dialog.focus();
    }

    function hidePrefsModal() {
        var modal = document.getElementById('cookie-prefs-modal');
        if (modal) modal.style.display = 'none';
    }

    function updateRevokeButton() {
        var btn = document.getElementById('cookie-revoke');
        if (btn) btn.style.display = getConsent() ? 'inline-block' : 'none';
    }

    // Verifica consenso esistente
    var consent = getConsent();
    if (consent) {
        if (consent.analytics) {
            gtag('consent', 'update', { analytics_storage: 'granted' });
        }
        updateRevokeButton();
    } else {
        showBanner();
    }

    // Event listeners banner
    var btnAccept = document.getElementById('cb-accept');
    var btnReject = document.getElementById('cb-reject');
    var btnPrefs = document.getElementById('cb-prefs');

    if (btnAccept) btnAccept.addEventListener('click', function() { saveConsent(true); });
    if (btnReject) btnReject.addEventListener('click', function() { saveConsent(false); });
    if (btnPrefs) btnPrefs.addEventListener('click', function() { showPrefsModal(); });

    // Event listeners modal preferenze
    var btnSave = document.getElementById('cb-save-prefs');
    var btnCancel = document.getElementById('cb-cancel-prefs');
    var prefsBackdrop = document.querySelector('#cookie-prefs-modal .cp-backdrop');

    if (btnSave) btnSave.addEventListener('click', function() {
        var toggle = document.getElementById('cb-analytics-toggle');
        saveConsent(toggle && toggle.checked);
        hidePrefsModal();
    });
    if (btnCancel) btnCancel.addEventListener('click', function() {
        hidePrefsModal();
        if (!getConsent()) showBanner();
    });
    if (prefsBackdrop) prefsBackdrop.addEventListener('click', function() {
        hidePrefsModal();
        if (!getConsent()) showBanner();
    });

    // Chiudi modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var modal = document.getElementById('cookie-prefs-modal');
            if (modal && modal.style.display === 'flex') {
                hidePrefsModal();
                if (!getConsent()) showBanner();
            }
        }
    });

    // Revoca consenso
    var revokeBtn = document.getElementById('cookie-revoke');
    if (revokeBtn) revokeBtn.addEventListener('click', function() {
        localStorage.removeItem(CONSENT_KEY);
        gtag('consent', 'update', { analytics_storage: 'denied' });
        updateRevokeButton();
        showBanner();
    });

    // --- Eventi: sposta eventi passati ---
    (function() {
        var cards = document.querySelectorAll('.evento-card[data-date]');
        if (!cards.length) return;
        var passatiSection = document.querySelector('.eventi-passati-section');
        var passatiList = passatiSection ? passatiSection.querySelector('.eventi-list') : null;
        var placeholder = document.querySelector('.eventi-placeholder');
        var futureList = document.querySelector('.eventi-section .eventi-list');
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        cards.forEach(function(card) {
            var parts = card.getAttribute('data-date').split('-');
            var eventDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            eventDate.setHours(0, 0, 0, 0);
            // Evento passato = il giorno successivo alla data dell'evento
            var nextDay = new Date(eventDate);
            nextDay.setDate(nextDay.getDate() + 1);
            if (today >= nextDay && passatiList) {
                passatiList.appendChild(card);
            }
        });

        if (passatiList && passatiList.children.length > 0 && passatiSection) {
            passatiSection.style.display = '';
        }
        if (futureList && futureList.children.length === 0 && placeholder) {
            placeholder.style.display = '';
        }
    })();

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

    // Horizontal Scroll Slider + Lightbox with navigation
    (function() {
        var slider = document.querySelector('.horiz-slider');
        if (!slider) return;

        var origSlides = Array.prototype.slice.call(slider.querySelectorAll('.horiz-slide'));
        var total = origSlides.length;
        if (!total) return;

        // Clone slides for infinite loop (append a full copy)
        origSlides.forEach(function(slide) {
            var clone = slide.cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            slider.appendChild(clone);
        });

        var allSlides = slider.querySelectorAll('.horiz-slide');

        // Infinite loop: when scrolled past originals, jump back
        function checkLoop() {
            var slideW = origSlides[0].offsetWidth +
                parseFloat(getComputedStyle(slider).gap || 0);
            var setWidth = slideW * total;
            if (slider.scrollLeft >= setWidth) {
                slider.scrollLeft -= setWidth;
            } else if (slider.scrollLeft <= 0) {
                slider.scrollLeft += setWidth;
            }
        }

        // Start at first real slide (not at 0 to allow backward scroll)
        requestAnimationFrame(function() {
            var slideW = origSlides[0].offsetWidth +
                parseFloat(getComputedStyle(slider).gap || 0);
            slider.scrollLeft = slideW * 0;
        });

        // Parallax scale on scroll
        var ticking = false;
        function updateParallax() {
            var sliderRect = slider.getBoundingClientRect();
            var center = sliderRect.left + sliderRect.width / 2;
            allSlides.forEach(function(slide) {
                var rect = slide.getBoundingClientRect();
                var slideCenter = rect.left + rect.width / 2;
                var dist = Math.abs(center - slideCenter);
                var maxDist = sliderRect.width / 2 + rect.width / 2;
                var ratio = Math.min(dist / maxDist, 1);
                var scale = 1 - ratio * 0.15;
                var img = slide.querySelector('img');
                if (img) img.style.transform = 'scale(' + scale + ')';
            });
            ticking = false;
        }

        var scrollTimer = null;
        slider.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(checkLoop, 100);
        }, { passive: true });

        updateParallax();

        // Auto-scroll
        var AUTOPLAY_MS = 3500;
        var autoplayTimer = null;
        var currentAuto = 0;

        function getSlideWidth() {
            return origSlides[0].offsetWidth +
                parseFloat(getComputedStyle(slider).gap || 0);
        }

        function autoAdvance() {
            currentAuto++;
            var slideW = getSlideWidth();
            var target = slideW * currentAuto;
            slider.scrollTo({ left: target, behavior: 'smooth' });

            // After smooth scroll ends, check if we need to loop
            setTimeout(function() {
                if (currentAuto >= total) {
                    slider.style.scrollSnapType = 'none';
                    slider.scrollLeft = slider.scrollLeft - slideW * total;
                    currentAuto = currentAuto - total;
                    // Re-enable snap after instant jump
                    requestAnimationFrame(function() {
                        slider.style.scrollSnapType = '';
                    });
                }
                updateParallax();
            }, 600);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(autoAdvance, AUTOPLAY_MS);
        }

        function stopAutoplay() {
            if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
        }

        // Sync currentAuto with manual scroll position
        function syncAutoIndex() {
            var slideW = getSlideWidth();
            currentAuto = Math.round(slider.scrollLeft / slideW);
        }

        // Pause on interaction
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', function() { syncAutoIndex(); startAutoplay(); });
        slider.addEventListener('touchstart', stopAutoplay, { passive: true });
        slider.addEventListener('touchend', function() { syncAutoIndex(); startAutoplay(); }, { passive: true });

        // Start autoplay when visible
        var sliderObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) { syncAutoIndex(); startAutoplay(); }
                else stopAutoplay();
            });
        }, { threshold: 0.3 });
        sliderObserver.observe(slider);

        // Desktop drag-to-scroll
        var isDragging = false, startX = 0, scrollLeftStart = 0;
        slider.addEventListener('mousedown', function(e) {
            isDragging = true;
            slider.classList.add('grabbing');
            startX = e.pageX - slider.offsetLeft;
            scrollLeftStart = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', function() {
            isDragging = false;
            slider.classList.remove('grabbing');
        });
        slider.addEventListener('mouseup', function() {
            isDragging = false;
            slider.classList.remove('grabbing');
        });
        slider.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            var x = e.pageX - slider.offsetLeft;
            slider.scrollLeft = scrollLeftStart - (x - startX);
        });

        // Click slide -> Lightbox (ignore if dragged)
        var dragMoved = false;
        slider.addEventListener('mousedown', function() { dragMoved = false; });
        slider.addEventListener('mousemove', function() { if (isDragging) dragMoved = true; });

        // Attach click to all slides (including clones), mapping to original index
        allSlides.forEach(function(slide, i) {
            slide.addEventListener('click', function(e) {
                if (dragMoved) { e.preventDefault(); return; }
                openLightbox(i % total);
            });
        });

        function openLightbox(index) {
            var lbIndex = index;
            var lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-label', 'Visualizzazione immagine ingrandita');
            document.body.appendChild(lightbox);

            var img = document.createElement('img');
            lightbox.appendChild(img);

            var closeBtn = document.createElement('span');
            closeBtn.classList.add('close');
            closeBtn.setAttribute('role', 'button');
            closeBtn.setAttribute('aria-label', 'Chiudi');
            closeBtn.innerHTML = '&times;';
            lightbox.appendChild(closeBtn);

            var lbPrev = document.createElement('button');
            lbPrev.className = 'lightbox-nav lightbox-nav--prev';
            lbPrev.setAttribute('aria-label', 'Foto precedente');
            lbPrev.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
            lightbox.appendChild(lbPrev);

            var lbNext = document.createElement('button');
            lbNext.className = 'lightbox-nav lightbox-nav--next';
            lbNext.setAttribute('aria-label', 'Foto successiva');
            lbNext.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';
            lightbox.appendChild(lbNext);

            var counter = document.createElement('div');
            counter.className = 'lightbox-counter';
            lightbox.appendChild(counter);

            function showImage(idx) {
                lbIndex = ((idx % total) + total) % total;
                var slideImg = origSlides[lbIndex].querySelector('img');
                img.classList.add('lb-fade');
                setTimeout(function() {
                    img.src = slideImg.currentSrc || slideImg.src;
                    img.alt = slideImg.alt || 'Immagine ingrandita';
                    counter.textContent = (lbIndex + 1) + ' / ' + total;
                    img.classList.remove('lb-fade');
                }, 200);
            }

            showImage(lbIndex);
            img.classList.remove('lb-fade');

            disableScroll();
            disableRellax();
            stopAutoplay();

            function closeLightbox() {
                lightbox.remove();
                enableScroll();
                enableRellax();
                syncAutoIndex();
                startAutoplay();
                document.removeEventListener('keydown', onKey);
            }

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) closeLightbox();
            });

            lbPrev.addEventListener('click', function(e) { e.stopPropagation(); showImage(lbIndex - 1); });
            lbNext.addEventListener('click', function(e) { e.stopPropagation(); showImage(lbIndex + 1); });

            function onKey(e) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(lbIndex - 1);
                if (e.key === 'ArrowRight') showImage(lbIndex + 1);
            }
            document.addEventListener('keydown', onKey);

            var lbTouchX = 0, lbDx = 0, lbSwiping = false;
            lightbox.addEventListener('touchstart', function(e) {
                lbTouchX = e.touches[0].clientX;
                lbDx = 0; lbSwiping = false;
            }, { passive: true });
            lightbox.addEventListener('touchmove', function(e) {
                lbDx = e.touches[0].clientX - lbTouchX;
                if (Math.abs(lbDx) > 10) lbSwiping = true;
            }, { passive: true });
            lightbox.addEventListener('touchend', function() {
                if (lbSwiping && Math.abs(lbDx) > 40) {
                    if (lbDx < 0) showImage(lbIndex + 1);
                    else showImage(lbIndex - 1);
                }
            }, { passive: true });
        }
    })();

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
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        document.documentElement.style.scrollBehavior = '';
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

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = "none";
                videoFrame.src = "";
            }
        });
    }
});
