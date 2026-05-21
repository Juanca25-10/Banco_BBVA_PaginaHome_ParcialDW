/* =========================================================
   LOGIN BBVA — script_login.js
   Incluye: Toggle passwords · Carrusel · Tabs · Toast · Registro
   ========================================================= */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. TOGGLE DE CONTRASEÑAS (reutilizable)
   ───────────────────────────────────────────────────────── */
(function initPasswordToggles() {

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

    // Login
    bindToggle('loginPassword',      'toggleLoginPwd',      'eyeLoginOpen',      'eyeLoginClosed');
    // Registro
    bindToggle('regPassword',        'toggleRegPwd',        'eyeRegOpen',        'eyeRegClosed');
    bindToggle('regPasswordConfirm', 'toggleRegPwdConfirm', 'eyeRegOpenConfirm', 'eyeRegClosedConfirm');

})();


/* ─────────────────────────────────────────────────────────
   2. TABS  (Login ↔ Registrarse)
   ───────────────────────────────────────────────────────── */
(function initTabs() {

    var btnLogin    = document.getElementById('tabBtnLogin');
    var btnRegister = document.getElementById('tabBtnRegister');
    var panelLogin  = document.getElementById('tabLogin');
    var panelReg    = document.getElementById('tabRegister');
    var btnSide     = document.getElementById('btnSideRegister'); // botón del panel derecho

    if (!btnLogin || !btnRegister) return;

    function activate(activeBtn, activePanel, inactiveBtn, inactivePanel) {
        // Panel activo
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
        activePanel.classList.add('active');

        // Panel inactivo
        inactiveBtn.classList.remove('active');
        inactiveBtn.setAttribute('aria-selected', 'false');
        inactivePanel.classList.remove('active');
    }

    btnLogin.addEventListener('click', function () {
        activate(btnLogin, panelLogin, btnRegister, panelReg);
    });

    btnRegister.addEventListener('click', function () {
        activate(btnRegister, panelReg, btnLogin, panelLogin);
    });

    // El botón "Regístrate" del panel derecho abre el Tab 2
    if (btnSide) {
        btnSide.addEventListener('click', function () {
            activate(btnRegister, panelReg, btnLogin, panelLogin);
            // Scroll suave al top del left-zone
            var lz = document.querySelector('.left-zone');
            if (lz) lz.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

})();


/* ─────────────────────────────────────────────────────────
   3. VALIDACIÓN DEL FORMULARIO DE REGISTRO
   ───────────────────────────────────────────────────────── */
(function initRegisterValidation() {

    var form            = document.getElementById('registerForm');
    var nombre          = document.getElementById('regNombre');
    var email           = document.getElementById('regEmail');
    var password        = document.getElementById('regPassword');
    var passwordConfirm = document.getElementById('regPasswordConfirm');
    var errorMsg        = document.getElementById('regPasswordError');

    if (!form) return;

    // Marcar campo con error o limpiarlo
    function markError(field, hasError) {
        field.style.borderColor = hasError ? '#c0392b' : '';
    }

    // Limpiar bordes al escribir
    [nombre, email, password, passwordConfirm].forEach(function (field) {
        if (!field) return;
        field.addEventListener('input', function () {
            markError(field, false);
            if (field === password || field === passwordConfirm) {
                if (errorMsg) errorMsg.style.display = 'none';
            }
        });
    });

    form.addEventListener('submit', function (e) {

        var valid = true;

        // Nombre obligatorio
        if (!nombre || nombre.value.trim() === '') {
            markError(nombre, true);
            valid = false;
        }

        // Email obligatorio y formato básico
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.value.trim())) {
            markError(email, true);
            valid = false;
        }

        // Password: mínimo 6 caracteres
        if (!password || password.value.length < 6) {
            markError(password, true);
            valid = false;
        }

        // Las contraseñas deben coincidir
        if (!passwordConfirm || password.value !== passwordConfirm.value) {
            markError(passwordConfirm, true);
            if (errorMsg) {
                errorMsg.textContent = password.value.length < 6
                    ? 'La contraseña debe tener al menos 6 caracteres.'
                    : 'Las contraseñas no coinciden.';
                errorMsg.style.display = 'block';
            }
            valid = false;
        }

        if (!valid) {
            e.preventDefault(); // Detener envío si hay errores
        }
    });

})();


/* ─────────────────────────────────────────────────────────
   4. TOAST DE REGISTRO EXITOSO
      Solo se activa si el elemento #bbvaToast existe en el DOM
      (el servidor lo renderiza cuando registerSuccess = true)
   ───────────────────────────────────────────────────────── */
(function initToast() {

    var toast    = document.getElementById('bbvaToast');
    var closeBtn = document.getElementById('toastCloseBtn');

    if (!toast || !closeBtn) return;  // No hay toast → no hacer nada

    var AUTO_CLOSE_MS = 7000; // 7 segundos → cierre automático

    function closeToast() {
        toast.classList.add('closing');
        // Esperar a que termine la animación de salida y luego recargar
        toast.addEventListener('animationend', function () {
            window.location.href = '/';   // Recarga → muestra Tab Login
        }, { once: true });
    }

    // Cierre manual con el botón ×
    closeBtn.addEventListener('click', closeToast);

    // Cierre automático
    var autoTimer = setTimeout(closeToast, AUTO_CLOSE_MS);

    // Si el usuario pasa el mouse encima, pausar el auto-cierre
    toast.addEventListener('mouseenter', function () {
        clearTimeout(autoTimer);
    });
    toast.addEventListener('mouseleave', function () {
        autoTimer = setTimeout(closeToast, 3000); // 3 s más al salir
    });

})();


/* ─────────────────────────────────────────────────────────
   5. CARRUSEL DE ALERTAS DE SEGURIDAD
   ───────────────────────────────────────────────────────── */
(function initAlertCarousel() {

    var track    = document.getElementById('alertTrack');
    var btnPrev  = document.getElementById('alertPrev');
    var btnNext  = document.getElementById('alertNext');
    var btnPause = document.getElementById('alertPause');
    var counter  = document.getElementById('alertCounter');
    var iconPause = document.getElementById('iconPause');
    var iconPlay  = document.getElementById('iconPlay');

    if (!track || !btnPrev || !btnNext || !btnPause || !counter) return;

    var slides     = track.querySelectorAll('.alert-slide');
    var total      = slides.length || 1;
    var autoMs     = 3500;
    var current    = 0;
    var paused     = false;
    var timer      = null;

    function updateA11y() {
        slides.forEach(function (s, i) {
            s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
        });
    }

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        counter.textContent   = (current + 1) + ' de ' + total;
        updateA11y();
    }

    function startAutoplay() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, autoMs);
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
            if (iconPlay)  iconPlay.style.display  = 'block';
            btnPause.setAttribute('aria-label', 'Reanudar autoplay');
        } else {
            startAutoplay();
            if (iconPause) iconPause.style.display = 'block';
            if (iconPlay)  iconPlay.style.display  = 'none';
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
        alertCard.addEventListener('mouseenter', function () { if (!paused) stopAutoplay(); });
        alertCard.addEventListener('mouseleave', function () { if (!paused) startAutoplay(); });
    }

    // Touch / swipe
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


/* ─────────────────────────────────────────────────────────
   6. CUSTOM SELECT BBVA
   ───────────────────────────────────────────────────────── */
(function initCustomSelect() {

    var trigger    = document.getElementById('customSelectTrigger');
    var optionsBox = document.getElementById('customOptions');
    var selected   = document.getElementById('selectedOption');

    if (!trigger || !optionsBox || !selected) return;

    var options = optionsBox.querySelectorAll('.custom-option');

    trigger.addEventListener('click', function () {
        optionsBox.classList.toggle('open');
        trigger.classList.toggle('active');
    });

    options.forEach(function (option) {
        option.addEventListener('click', function () {
            options.forEach(function (o) { o.classList.remove('active'); });
            option.classList.add('active');
            selected.textContent = option.textContent;
            optionsBox.classList.remove('open');
            trigger.classList.remove('active');
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-select-wrapper')) {
            optionsBox.classList.remove('open');
            trigger.classList.remove('active');
        }
    });

})();