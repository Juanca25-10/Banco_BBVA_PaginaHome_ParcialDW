const mysql = require("mysql");

// 1. Conexión a la base de datos (Directo en el controlador)
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT || 3307
});

exports.login = (req, res) => {
    console.log(req.body); // Imprime { name: '...', email: '...', password: '...' }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE email = ?", [email], async function (error, results) {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            var data = JSON.parse(JSON.stringify(results));

            var user_id = data[0].id;
            var user_name = data[0].name;
            var user_email = data[0].email;
            var user_password = data[0].password;

            if (user_email == email && user_password == password) {
                // Mensajes idénticos a los del profe
                console.log(user_name); 
                console.log("Login exitoso!");

                req.session.user = {
                    id: user_id,
                    name: user_name,
                    email: user_email
                };

                console.log(req.session.user); 

                // El profe usa "Bienvenido: " con dos puntos
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

exports.logout = (req, res) => {
    // Mensaje idéntico al del profe al destruir la sesión
    console.log("session a borrar: ", req.session);
    req.session.destroy((err) => {
        if (err) {
            console.log("Error al destruir la sesión:", err);
            return res.status(500).send("Error al cerrar sesión");
        }
        res.clearCookie("connect.sid"); 
        res.redirect("/"); // Redirige al index
    });
}