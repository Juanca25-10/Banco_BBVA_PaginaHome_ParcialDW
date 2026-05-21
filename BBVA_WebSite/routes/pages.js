const express = require("express");
const router  = express.Router();

// Página principal — Login + Registro en Tabs
router.get("/", (req, res) => {
    res.render("index");
});

// Ya no se necesita /register (el formulario está en el Tab de index)
// Redirigir por si alguien llega con un enlace viejo
router.get("/register", (req, res) => {
    res.redirect("/");
});

module.exports = router;