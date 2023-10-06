const conn = require('../database/conexion.js');

//============================================= USUARIOS ==============================================
function getIdUsuario(correo) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_usuario FROM Usuarios WHERE correo = ?', correo, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_usuario: result[0].id_usuario });
                } else {
                    resolve({ status: false });
                }
            }
        }));
    });
}

function getCredencialesUsuario(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT correo, password FROM Usuarios WHERE id_usuario = ?', id_usuario, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, correo: result[0].correo, password: result[0].password });
                } else {
                    resolve({ status: false });
                }
            }
        }));
    });
}

function getIdAllUsuarios() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_usuario FROM Usuarios', ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }));
    });
}

//=========================================== PUBLICACIONES ===========================================
function createPublicacion(descripcion, id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Publicaciones (descripcion, id_usuario) VALUES (?, ?)',
            [descripcion, id_usuario], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: true, id_publicacion: result.insertId });
            }
        }));
    });
}

module.exports = { 
    getIdUsuario,
    getCredencialesUsuario,
    getIdAllUsuarios,
    createPublicacion
};