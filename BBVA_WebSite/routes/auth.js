const express        = require("express");
const AuthController = require("../controllers/auth"); // Vincula el controlador
const router         = express.Router();

/* ── Ruta para Login ── */
router.post("/login", AuthController.login);

/* ── Ruta para Logout ── */
router.post("/logout", AuthController.logout);

/* ── Ruta para Registro ── */
// Ahora llama limpiamente al método que creamos en el controlador
router.post("/register", AuthController.register);

module.exports = router;