const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
const session = require("express-session");

const app = express();

// 1. Cargar variables de entorno (¡PRIMER PASO SIEMPRE!)
dotenv.config({ path: "./.env" });

// 2. Configurar Sesión
app.use(session({
    secret: process.env.SESSION_SECRET, // Ahora sí coinciden los nombres
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 60 * 60 * 1000, // 1 hora
        httpOnly: false
    }
}));

// 3. Configurar el motor de plantillas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// 4. Servir archivos estáticos (CSS)
const publicDirectory = path.join(__dirname, "public");
app.use(express.static(publicDirectory));

// 5. Middlewares para leer datos de formularios (Deben ir ANTES de las rutas)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// 7. DEFINICIÓN DE RUTAS
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

// 8. Encender el servidor
app.listen(5000, () => {
    console.log(" Servidor listo en http://localhost:5000");
});

// 2. Loli