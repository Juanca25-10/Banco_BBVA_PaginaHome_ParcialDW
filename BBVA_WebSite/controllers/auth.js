const mysql = require("mysql");
const bcrypt = require("bcryptjs"); // 1. Importamos la librería de encriptación

// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT || 3307
});

/* ── MÉTODO DE LOGIN ── */
exports.login = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    // Hacemos el callback 'async' para poder usar await con bcrypt
    db.query("SELECT * FROM users WHERE email = ?", [email], async function (error, results) {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            var data = JSON.parse(JSON.stringify(results));

            var user_id = data[0].id;
            var user_name = data[0].name;
            var user_email = data[0].email;
            var user_password = data[0].password; // Esta es la contraseña encriptada de la BD

            // 2. Comparamos la contraseña plana (password) con la encriptada (user_password)
            const contrasenaCorrecta = await bcrypt.compare(password, user_password);

            if (user_email == email && contrasenaCorrecta) {
                console.log(user_name); 
                console.log("Login exitoso!");

                req.session.user = {
                    id: user_id,
                    name: user_name,
                    email: user_email
                };

                let message = "Bienvenido: ";

                req.session.save((err) => {
                    if (err) {
                        console.log("Error al guardar la sesión:", err);
                    } else {
                        console.log("Sesion guardada con exito");
                    }
                    return res.render("login", { message, data_user: req.session.user });
                });

            } else {
                res.render("index", { message: "Usuario o contraseña incorrectos" });
            }
        } else {
            res.render("index", { message: "Usuario no existe en la BD" });
        }
    });
}

/* ── MÉTODO DE LOGOUT ── */
exports.logout = (req, res) => {
    console.log("session a borrar: ", req.session);
    req.session.destroy((err) => {
        if (err) {
            console.log("Error al destruir la sesión:", err);
            return res.status(500).send("Error al cerrar sesión");
        }
        res.clearCookie("connect.sid"); 
        res.redirect("/"); 
    });
}

/* ── MÉTODO DE REGISTRO ── */
exports.register = (req, res) => {
    const { nombre, email, password, passwordConfirm } = req.body;

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

    // Convertimos a async para usar await al encriptar
    db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
        if (error) {
            console.log("Error al verificar correo:", error);
            return res.render("index", {
                registerMessage: "Error en el servidor al verificar el usuario.",
                openRegisterTab: true
            });
        }

        if (results.length > 0) {
            return res.render("index", {
                registerMessage: "Este correo electrónico ya se encuentra registrado.",
                openRegisterTab: true
            });
        }

        // 3. ENCRIPTAMOS LA CONTRASEÑA
        // El '10' es el número de saltos. Entre mayor sea, más seguro, pero 10 es el estándar óptimo.
        let hashedPassword = await bcrypt.hash(password, 10);

        // Guardamos 'hashedPassword' en lugar de la contraseña normal
        db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [nombre, email, hashedPassword], (error, results) => {
            if (error) {
                console.log("Error al insertar usuario:", error);
                return res.render("index", {
                    registerMessage: "Hubo un error al registrar el usuario. Inténtalo de nuevo.",
                    openRegisterTab: true
                });
            }

            // 👇 AQUÍ PONEMOS EL CONSOLE.LOG DEL ÉXITO 👇
            console.log(`✅ REGISTRO EXITOSO: Se ha registrado el usuario '${nombre}' con el correo '${email}'`);

            return res.render("index", {
                registerSuccess: true,
                registerName: nombre,
                registerEmail: email
            });
        });
    });

};