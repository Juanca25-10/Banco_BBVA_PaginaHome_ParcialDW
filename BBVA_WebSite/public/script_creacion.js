/* ==============================
   BBVA - script_creacion.js
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Referencias DOM ── */
  const nombre          = document.getElementById('nombre');
  const email           = document.getElementById('email');
  const password        = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const terms           = document.getElementById('terms');
  const btnComenzar     = document.getElementById('btnComenzar');
  const validationMsg   = document.getElementById('validationMsg');

  /* ── Toggle mostrar/ocultar contraseña ── */
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';

      // Cambiar ícono (ojo abierto / ojo tachado)
      const eyeIcon = btn.querySelector('.eye-icon');
      if (eyeIcon) {
        if (!isText) {
          // Mostrar ojo tachado (contraseña visible)
          eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          `;
        } else {
          // Ojo abierto (contraseña oculta)
          eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          `;
        }
      }
    });
  });

  /* ── Helpers de validación ── */
  function setError(inputEl, msg) {
    inputEl.closest('.input-group').classList.add('error');
    showMsg(msg, 'error');
  }

  function clearError(inputEl) {
    inputEl.closest('.input-group').classList.remove('error');
  }

  function showMsg(msg, type = 'error') {
    validationMsg.textContent = msg;
    validationMsg.style.color = type === 'error' ? '#DC2626' : '#16A34A';
  }

  function clearMsg() {
    validationMsg.textContent = '';
  }

  /* ── Limpiar error al escribir ── */
  [nombre, email, password, confirmPassword].forEach(input => {
    input.addEventListener('input', () => {
      clearError(input);
      clearMsg();
    });
  });

  /* ── Validaciones individuales ── */
  function validateNombre() {
    const val = nombre.value.trim();
    if (!val) {
      setError(nombre, 'Por favor ingresa tu nombre.');
      return false;
    }
    if (val.length < 2) {
      setError(nombre, 'El nombre debe tener al menos 2 caracteres.');
      return false;
    }
    clearError(nombre);
    return true;
  }

  function validateEmail() {
    const val = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setError(email, 'Por favor ingresa tu correo electrónico.');
      return false;
    }
    if (!emailRegex.test(val)) {
      setError(email, 'Ingresa un correo electrónico válido.');
      return false;
    }
    clearError(email);
    return true;
  }

  function validatePassword() {
    const val = password.value;
    if (!val) {
      setError(password, 'Por favor ingresa una contraseña.');
      return false;
    }
    if (val.length < 8) {
      setError(password, 'La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    // Al menos una mayúscula, una minúscula y un número
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!strongRegex.test(val)) {
      setError(password, 'La contraseña debe contener mayúsculas, minúsculas y números.');
      return false;
    }
    clearError(password);
    return true;
  }

  function validateConfirmPassword() {
    const val = confirmPassword.value;
    if (!val) {
      setError(confirmPassword, 'Por favor confirma tu contraseña.');
      return false;
    }
    if (val !== password.value) {
      setError(confirmPassword, 'Las contraseñas no coinciden.');
      return false;
    }
    clearError(confirmPassword);
    return true;
  }

  function validateTerms() {
    if (!terms.checked) {
      showMsg('Debes aceptar la Autorización de Tratamiento de Datos Personales.');
      return false;
    }
    return true;
  }

  /* ── Blur-time validation (individual fields) ── */
  nombre.addEventListener('blur',          validateNombre);
  email.addEventListener('blur',           validateEmail);
  password.addEventListener('blur',        validatePassword);
  confirmPassword.addEventListener('blur', validateConfirmPassword);

  /* ── Submit ── */
  btnComenzar.addEventListener('click', () => {
    clearMsg();

    const v1 = validateNombre();
    const v2 = validateEmail();
    const v3 = validatePassword();
    const v4 = validateConfirmPassword();
    const v5 = validateTerms();

    if (v1 && v2 && v3 && v4 && v5) {
      handleSubmit();
    }
  });

  /* ── Acción de envío ── */
  function handleSubmit() {
    btnComenzar.disabled    = true;
    btnComenzar.textContent = 'Procesando...';
    btnComenzar.style.opacity = '0.75';

    // Simular llamada al servidor
    setTimeout(() => {
      showMsg('¡Cuenta creada con éxito! Bienvenido a BBVA.', 'success');
      btnComenzar.disabled    = false;
      btnComenzar.textContent = 'Comenzar';
      btnComenzar.style.opacity = '1';

      // Limpiar formulario tras éxito
      nombre.value          = '';
      email.value           = '';
      password.value        = '';
      confirmPassword.value = '';
      terms.checked         = false;
    }, 1800);
  }

  /* ── Botón "Abrir mi cuenta" del nav: scroll al form ── */
  const btnAbrir = document.querySelector('.btn-abrir');
  if (btnAbrir) {
    btnAbrir.addEventListener('click', () => {
      document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

});