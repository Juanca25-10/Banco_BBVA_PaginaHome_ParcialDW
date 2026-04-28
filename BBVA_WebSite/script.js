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
