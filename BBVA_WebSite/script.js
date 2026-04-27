    // Seleccionamos el header
    const header = document.getElementById('bbva-header');

    // Escuchamos el evento de scroll en la ventana
    window.addEventListener('scroll', () => {
        // Si bajamos más de 20 píxeles, le agregamos la clase que lo encoge
        if (window.scrollY > 20) {
            header.classList.add('header-scrolled');
        } else {
            // Si volvemos arriba, se la quitamos para que flote de nuevo
            header.classList.remove('header-scrolled');
        }
    });
