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

/* =========================================================
   CARRUSELES MÓVILES — Quick Actions & Toolgrid
   Quick Actions: 6 cards, 2 visibles por página → 3 páginas
   Toolgrid:      2 cards, 1 visible por página  → 2 páginas
   ========================================================= */
(function initMobileCarousels() {
    'use strict';

    /**
     * Carrusel de páginas usando CSS transform (no scrollLeft).
     * El track tiene width: N*100% y se mueve con translateX.
     */
    function buildPageCarousel(opts) {
        var track      = document.getElementById(opts.trackId);
        var prevBtn    = document.getElementById(opts.prevId);
        var nextBtn    = document.getElementById(opts.nextId);
        var counter    = document.getElementById(opts.counterId);
        var totalPages = opts.totalPages || 1;
        var current    = 0;

        if (!track || !prevBtn || !nextBtn || !counter) return;

        function setButtons() {
            prevBtn.disabled = (current === 0);
            nextBtn.disabled = (current === totalPages - 1);
            prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
            nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
        }

        function goTo(index) {
            current = Math.max(0, Math.min(index, totalPages - 1));
            /* Cada página es 1/totalPages del track (que mide totalPages*100%) */
            var pct = current * (100 / totalPages);
            track.style.transform = 'translateX(-' + pct + '%)';
            counter.textContent = (current + 1) + ' de ' + totalPages;
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
            if (Math.abs(delta) > 40) {
                goTo(delta > 0 ? current + 1 : current - 1);
            }
        }, { passive: true });

        /* Reset al pasar a desktop */
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                track.style.transform = '';
                current = 0;
            } else {
                goTo(current);
            }
        });

        goTo(0);
    }

    function init() {
        if (window.innerWidth > 768) return;

        /* Quick Actions: 3 páginas de 2 cards */
        buildPageCarousel({
            trackId:    'qaTrack',
            prevId:     'qaPrev',
            nextId:     'qaNext',
            counterId:  'qaCounter',
            totalPages: 3
        });

        /* Cards "Con todo lo que te importa": 3 páginas de 1 card */
        buildPageCarousel({
            trackId:    'cardsTrack',
            prevId:     'cardsPrev',
            nextId:     'cardsNext',
            counterId:  'cardsCounter',
            totalPages: 3
        });

        /* Toolgrid: 2 páginas de 1 card */
        buildPageCarousel({
            trackId:    'toolTrack',
            prevId:     'toolPrev',
            nextId:     'toolNext',
            counterId:  'toolCounter',
            totalPages: 2
        });
    }

    init();

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

function closeWelcomeBanner() {
    const banner = document.getElementById('welcomeBanner');
    if (banner) {
        // Le añadimos una transición suave al cerrar
        banner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            banner.remove();
        }, 400);
    }
}