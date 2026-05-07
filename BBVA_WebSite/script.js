window.addEventListener('scroll', () => {
    const header = document.getElementById('bbva-header');
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

/* =========================================================
   CARRUSEL HERO BBVA
   Desarrollado por: [Tu nombre]
   ========================================================= */
(function () {
    'use strict';
 
    const TOTAL_SLIDES = 4;
 
    // Referencias al DOM
    const track   = document.getElementById('carouselTrack');
    const btnPrev = document.getElementById('carouselPrev');
    const btnNext = document.getElementById('carouselNext');
    const counter = document.getElementById('carouselCounter');
 
    // Si algún elemento no existe, salimos para no generar errores
    if (!track || !btnPrev || !btnNext || !counter) return;
 
    let currentSlide = 0; // Índice del slide activo (empieza en 0)
 
    /**
     * Mueve el carrusel al slide indicado por índice.
     * @param {number} index - Número de slide destino (base 0)
     */
    function goToSlide(index) {
        // Clampear para no salirse del rango
        currentSlide = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
 
        // Mover la pista desplazando 100% por cada slide
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
 
        // Actualizar contador "X de 4"
        counter.textContent = `${currentSlide + 1} de ${TOTAL_SLIDES}`;
 
        // Actualizar accesibilidad y estado de los botones
        updateButtons();
    }
 
    /**
     * Habilita/deshabilita los botones según la posición actual.
     */
    function updateButtons() {
        btnPrev.disabled = currentSlide === 0;
        btnNext.disabled = currentSlide === TOTAL_SLIDES - 1;
 
        btnPrev.setAttribute('aria-disabled', btnPrev.disabled);
        btnNext.setAttribute('aria-disabled', btnNext.disabled);
    }
 
    // --- Eventos de los botones ---
    btnPrev.addEventListener('click', function () {
        goToSlide(currentSlide - 1);
    });
 
    btnNext.addEventListener('click', function () {
        goToSlide(currentSlide + 1);
    });
 
    // --- Soporte de teclado (←  →) cuando el carrusel tiene el foco ---
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  goToSlide(currentSlide - 1);
        if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });
 
    // --- Soporte de swipe táctil ---
    let touchStartX = 0;
 
    track.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
 
    track.addEventListener('touchend', function (e) {
        const delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) {          // umbral mínimo de 50px
            delta > 0 ? goToSlide(currentSlide + 1)
                      : goToSlide(currentSlide - 1);
        }
    }, { passive: true });
 
    // Estado inicial
    goToSlide(0);
 
})();

/* ── Parallax moneda: entra desde arriba hacia la tarjeta ── */
(function() {
    const coinImg = document.querySelector('.col-image img');
    const card = document.querySelector('.highlight-card');
    if (!coinImg || !card) return;

    /* Posición inicial: la moneda empieza 180px más arriba */
    coinImg.style.transform = 'translateY(-420px) scale(1.3)';

    window.addEventListener('scroll', function() {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        /* Calcula cuánto ha entrado la tarjeta en pantalla */
        const progress = Math.max(0, Math.min(1, 
            (windowHeight - cardTop) / (windowHeight * 0.8)
        ));

        /* Interpola desde -420px hasta 0px */
        const offset = -300 * (1 - progress);

        /* Escala: empieza en 1.3 y termina en 1 */
        const scale = 1.3 - (0.3 * progress);

        coinImg.style.transform = `translateY(${offset}px) scale(${scale})`;
    }, { passive: true });
})();





/* ==========================================================
   CARRUSELES MÓVILES — Quick Actions & Toolgrid
   Solo se inicializan en pantallas ≤ 768px
   ========================================================== */

(function initMobileCarousels() {
    'use strict';

    if (window.innerWidth > 768) return;

    /**
     * Construye un carrusel por scroll controlado con botones.
     * @param {Object} opts
     *   trackId     – id del contenedor (overflow: scroll)
     *   prevId      – id botón anterior
     *   nextId      – id botón siguiente
     *   counterId   – id del span contador
     *   totalPages  – número de páginas
     *   itemsPerPage– cuántos ítems se muestran por página
     */
    function buildCarousel(opts) {
        var track      = document.getElementById(opts.trackId);
        var prevBtn    = document.getElementById(opts.prevId);
        var nextBtn    = document.getElementById(opts.nextId);
        var counter    = document.getElementById(opts.counterId);

        if (!track || !prevBtn || !nextBtn || !counter) return;

        var totalPages   = opts.totalPages || 1;
        var current      = 0;

        function updateCounter() {
            counter.textContent = (current + 1) + ' de ' + totalPages;
        }

        function setButtons() {
            prevBtn.disabled = (current === 0);
            nextBtn.disabled = (current === totalPages - 1);
            prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
            nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
        }

        function goTo(index) {
            current = Math.max(0, Math.min(index, totalPages - 1));
            /* Calcula el scrollLeft basado en la fracción del total */
            var scrollAmount = (track.scrollWidth / totalPages) * current;
            track.scrollLeft = scrollAmount;
            updateCounter();
            setButtons();
        }

        prevBtn.addEventListener('click', function () { goTo(current - 1); });
        nextBtn.addEventListener('click', function () { goTo(current + 1); });

        /* Swipe táctil */
        var touchStartX = 0;
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
            var delta = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(delta) > 50) {
                goTo(delta > 0 ? current + 1 : current - 1);
            }
        }, { passive: true });

        /* Estado inicial */
        goTo(0);
    }

    /* ── Quick Actions: 6 tarjetas, 2 visibles → 3 páginas ── */
    buildCarousel({
        trackId:    'qaTrack',
        prevId:     'qaPrev',
        nextId:     'qaNext',
        counterId:  'qaCounter',
        totalPages: 3
    });

    /* ── Toolgrid: 2 tarjetas, 1 visible → 2 páginas ── */
    buildCarousel({
        trackId:    'toolTrack',
        prevId:     'toolPrev',
        nextId:     'toolNext',
        counterId:  'toolCounter',
        totalPages: 2
    });

})();

/* ── Deshabilitar parallax de moneda en mobile ── */
(function disableCoinParallaxOnMobile() {
    'use strict';
    if (window.innerWidth > 768) return;
    var coinImg = document.querySelector('.col-image img');
    if (!coinImg) return;
    coinImg.style.transform = 'none';
    coinImg.style.willChange = 'auto';
})();