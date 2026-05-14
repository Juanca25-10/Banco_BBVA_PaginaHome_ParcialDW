/* =========================================================
   LOGIN BBVA — script_login.js
   ========================================================= */

'use strict';

/* ── Toggle de contraseñas ── */
(function initPasswordToggle() {

    function bindToggle(inputId, btnId, eyeOpenId, eyeClosedId) {
        var input     = document.getElementById(inputId);
        var btn       = document.getElementById(btnId);
        var eyeOpen   = document.getElementById(eyeOpenId);
        var eyeClosed = document.getElementById(eyeClosedId);

        if (!input || !btn || !eyeOpen || !eyeClosed) return;

        btn.addEventListener('click', function () {
            var isPassword = input.type === 'password';

            input.type              = isPassword ? 'text'  : 'password';
            eyeOpen.style.display   = isPassword ? 'none'  : 'block';
            eyeClosed.style.display = isPassword ? 'block' : 'none';

            btn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
        });
    }

    bindToggle('passwordField', 'togglePwd', 'eyeOpen', 'eyeClosed');
    bindToggle('passwordConfirmField', 'togglePwdConfirm', 'eyeOpenConfirm', 'eyeClosedConfirm');

})();


/* ── Carrusel de alertas de seguridad ── */
(function initAlertCarousel() {

    var track     = document.getElementById('alertTrack');
    var btnPrev   = document.getElementById('alertPrev');
    var btnNext   = document.getElementById('alertNext');
    var btnPause  = document.getElementById('alertPause');
    var counter   = document.getElementById('alertCounter');
    var iconPause = document.getElementById('iconPause');
    var iconPlay  = document.getElementById('iconPlay');

    if (!track || !btnPrev || !btnNext || !btnPause || !counter) return;

    var slides      = track.querySelectorAll('.alert-slide');
    var total       = slides.length || 1;
    var autoplayMs  = 3500;
    var current     = 0;
    var paused      = false;
    var timer       = null;

    function updateA11y() {
        slides.forEach(function (slide, index) {
            slide.setAttribute('aria-hidden', index === current ? 'false' : 'true');
        });
    }

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        counter.textContent = (current + 1) + ' de ' + total;
        updateA11y();
    }

    function startAutoplay() {
        clearInterval(timer);
        timer = setInterval(function () {
            goTo(current + 1);
        }, autoplayMs);
    }

    function stopAutoplay() {
        clearInterval(timer);
        timer = null;
    }

    function togglePause() {
        paused = !paused;

        if (paused) {
            stopAutoplay();
            if (iconPause) iconPause.style.display = 'none';
            if (iconPlay) iconPlay.style.display = 'block';
            btnPause.setAttribute('aria-label', 'Reanudar autoplay');
        } else {
            startAutoplay();
            if (iconPause) iconPause.style.display = 'block';
            if (iconPlay) iconPlay.style.display = 'none';
            btnPause.setAttribute('aria-label', 'Pausar autoplay');
        }
    }

    btnNext.addEventListener('click', function () {
        goTo(current + 1);
        if (!paused) { stopAutoplay(); startAutoplay(); }
    });

    btnPrev.addEventListener('click', function () {
        goTo(current - 1);
        if (!paused) { stopAutoplay(); startAutoplay(); }
    });

    btnPause.addEventListener('click', togglePause);

    var alertCard = track.closest('.alert-card');
    if (alertCard) {
        alertCard.addEventListener('mouseenter', function () {
            if (!paused) stopAutoplay();
        });
        alertCard.addEventListener('mouseleave', function () {
            if (!paused) startAutoplay();
        });
    }

    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
        var delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 45) {
            goTo(delta > 0 ? current + 1 : current - 1);
            if (!paused) { stopAutoplay(); startAutoplay(); }
        }
    }, { passive: true });

    goTo(0);
    startAutoplay();

})();


/* ── Validación visual básica del formulario ── */
(function initFormValidation() {

    var btnLogin     = document.querySelector('.btn-login');
    var docNumber    = document.getElementById('docNumber');
    var password     = document.getElementById('passwordField');
    var passwordConf = document.getElementById('passwordConfirmField');

    if (!btnLogin) return;

    btnLogin.addEventListener('click', function () {

        var docVal      = docNumber ? docNumber.value.trim() : '';
        var passVal     = password ? password.value.trim() : '';
        var passConfVal = passwordConf ? passwordConf.value.trim() : '';

        if (docNumber) docNumber.style.borderColor = docVal ? '' : '#c0392b';
        if (password) password.style.borderColor = passVal ? '' : '#c0392b';
        if (passwordConf) passwordConf.style.borderColor = passConfVal ? '' : '#c0392b';

        if (!docVal || !passVal || !passConfVal) return;

        if (passVal !== passConfVal) {
            passwordConf.style.borderColor = '#c0392b';
            return;
        }

        console.log('[BBVA Login Demo] Validación visual completada.');
    });

    [docNumber, password, passwordConf].forEach(function (field) {
        if (!field) return;
        field.addEventListener('input', function () {
            field.style.borderColor = '';
        });
    });

})();
