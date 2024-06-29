document.addEventListener('DOMContentLoaded', () => {
    let rellax = new Rellax('.rellax', {
        speed: -2,
        center: true
    });

    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 25); // Tempo di visualizzazione del loader
    });

    const bioButtonIta = document.getElementById('bio-button-ita');
    const bioButtonEng = document.getElementById('bio-button-eng');
    const bioModalIta = document.getElementById('bio-modal-ita');
    const bioModalEng = document.getElementById('bio-modal-eng');
    const closeBtns = document.querySelectorAll('.close');

    bioButtonIta.addEventListener('click', () => {
        bioModalIta.style.display = 'flex';
        disableScroll();
        disableRellax(); // Disabilita Rellax quando la lightbox si apre
    });

    bioButtonEng.addEventListener('click', () => {
        bioModalEng.style.display = 'flex';
        disableScroll();
        disableRellax(); // Disabilita Rellax quando la lightbox si apre
    });

    // Aggiungi event listener a tutti i bottoni di chiusura
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bioModalIta.style.display = 'none';
            bioModalEng.style.display = 'none';
            enableScroll();
            enableRellax(); // Riabilita Rellax quando la lightbox si chiude
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === bioModalIta || event.target === bioModalEng) {
            bioModalIta.style.display = 'none';
            bioModalEng.style.display = 'none';
            enableScroll();
            enableRellax(); // Riabilita Rellax quando la lightbox si chiude
        }
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
        link.addEventListener('click', function(event) {
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
        rellax.destroy(); // Disattiva Rellax
    }

    function enableRellax() {
        rellax = new Rellax('.rellax', { // Riattiva Rellax
            speed: -2,
            center: true
        });
    }
});
