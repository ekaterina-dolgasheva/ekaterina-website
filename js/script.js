document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href;
    let newUrl = currentUrl;

    // Controlla se la URL termina con "index.html"
    if (currentUrl.endsWith('index.html')) {
        newUrl = currentUrl.slice(0, -10) || '/';
    } 
  
    history.replaceState(null, '', newUrl);

    const loader = document.getElementById('loader');
    const firstVisitTimestamp = localStorage.getItem('firstVisitTimestamp');
    const currentTime = new Date().getTime();
    const tenMinutes = 300000; // 5 minuti in millisecondi

    // Verifica se è la prima visita o se sono passati più di 10 minuti dall'ultima visita
    if (loader) {
        if (!firstVisitTimestamp || (currentTime - firstVisitTimestamp) > tenMinutes) {
            localStorage.setItem('firstVisitTimestamp', currentTime);

            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, 2200); // Tempo di visualizzazione del loader
            });
        } else {
            loader.style.display = 'none'; // Nasconde il loader se non è la prima visita
        }
    }

    // Parallax initialization
    let rellax;

    function initializeRellax() {
        rellax = new Rellax('.rellax', {
            speed: -2,
            center: true
        });
    }

    // Funzione per verificare se tutte le immagini sono caricate
    function imagesLoaded() {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
    }

    // Inizializza Rellax solo dopo che tutte le immagini sono caricate
    function initializeRellaxAfterImagesLoad() {
        if (imagesLoaded()) {
            initializeRellax();
        } else {
            window.addEventListener('load', () => {
                initializeRellax();
            });
        }
    }

    initializeRellaxAfterImagesLoad();

    const closeBtns = document.querySelectorAll('.close');

    // Aggiungi event listener a tutti i bottoni di chiusura
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            enableScroll();
            enableRellax(); // Riabilita Rellax quando la lightbox si chiude
        });
    });

    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            document.body.appendChild(lightbox);

            const img = document.createElement('img');
            img.src = image.src;
            lightbox.appendChild(img);

            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close');
            closeBtn.innerHTML = '&times;';
            lightbox.appendChild(closeBtn);

            disableScroll();
            disableRellax(); // Disabilita Rellax quando la lightbox si apre

            closeBtn.addEventListener('click', () => {
                lightbox.remove();
                enableScroll();
                enableRellax(); // Riabilita Rellax quando la lightbox si chiude
            });

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.remove();
                    enableScroll();
                    enableRellax(); // Riabilita Rellax quando la lightbox si chiude
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

    function disableRellax() {
        if (rellax) {
            rellax.destroy(); // Disattiva Rellax
        }
    }

    function enableRellax() {
        initializeRellax(); // Riattiva Rellax
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
