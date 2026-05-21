const express        = require("express");
const AuthController = require("../controllers/auth");
const router         = express.Router();

/* ── Login ── */
router.post("/login", AuthController.login);

/* ── Logout ── */
router.post("/logout", AuthController.logout);

/* ── Registro de nuevo usuario ──────────────────────────────
 *
 *  Campos que llegan en req.body:
 *    nombre         → nombre completo del usuario
 *    email          → correo electrónico
 *    password       → contraseña
 *    passwordConfirm→ confirmación (ya validada en JS; validar de nuevo aquí)
 *
 *  TODO para el compañero que conecta la BD:
 *  ─────────────────────────────────────────
 *  1. Verificar que password === passwordConfirm
 *  2. Consultar si el email ya existe en la BD:
 *       const [rows] = await db.query(
 *           'SELECT id FROM usuarios WHERE email = ?', [email]
 *       );
 *       if (rows.length > 0) → renderizar con error
 *
 *  3. Hashear la contraseña:
 *       const bcrypt = require('bcryptjs');
 *       const hash   = await bcrypt.hash(password, 10);
 *
 *  4. Insertar en la BD:
 *       await db.query(
 *           'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
 *           [nombre, email, hash]
 *       );
 *
 *  5. Renderizar con éxito → aparece el Toast
 * ─────────────────────────────────────────────────────────── */
router.post("/register", async (req, res) => {
    const { nombre, email, password, passwordConfirm } = req.body;

    // Validación básica servidor
    if (!nombre || !email || !password || !passwordConfirm) {
        return res.render("index", {
            registerMessage: "Todos los campos son obligatorios.",
            openRegisterTab: true
        });
    }

    if (password !== passwordConfirm) {
        return res.render("index", {
            registerMessage: "Las contraseñas no coinciden.",
            openRegisterTab: true
        });
    }

    try {

        /* ══════════════════════════════════════════════════════
           AQUÍ VA EL CÓDIGO DE BD (ver instrucciones arriba)
           ══════════════════════════════════════════════════════ */

        // Una vez registrado correctamente → mostrar Toast
        return res.render("index", {
            registerSuccess: true,
            registerName:    nombre,
            registerEmail:   email
        });

    } catch (error) {
        console.error("[BBVA Register Error]", error);
        return res.render("index", {
            registerMessage: "Error al registrar el usuario. Intenta de nuevo.",
            openRegisterTab: true
        });
    }
});

module.exports = router;