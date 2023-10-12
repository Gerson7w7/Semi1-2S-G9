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

function getPasswordUsuario(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT password FROM Usuarios WHERE id_usuario = ?', id_usuario, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, password: result[0].password });
                } else {
                    resolve({ status: false });
                }
            }
        }));
    });
}

function registrarUsuario(nombre, correo, dpi, password) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Usuarios (nombre, correo, dpi, password) VALUES (?, ?, ?, ?)',
            [nombre, correo, dpi, password], ((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: true, id_usuario: result.insertId});
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

function getPublicaciones(id_usuario) {
    id_usuario = `%${id_usuario}%`;
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Publicaciones WHERE id_usuario LIKE ?', [id_usuario], (async (err, result) => {
            if (err) {
                console.log("error en la consulta a la db en consultar publicaciones")
                reject(err);
            } else {
                //console.log("publicaciones consultas bien", result)
                let publicaciones = [];
                for (let publicacion of result) {
                    const consultar_comentarios = await getComentarios(publicacion.id_publicacion)
                    publicaciones.push({
                        id: publicacion.id_publicacion,
                        descripcion: publicacion.descripcion,
                        fecha: publicacion.fecha,
                        imagen: `${process.env.PREFIJO_BUCKET}Fotos/publicaciones/${publicacion.id_publicacion}.jpg`,
                        comentarios: consultar_comentarios.comentarios
                    })
                }
                resolve({ status: true, 'publicaciones': publicaciones });
            }
        }));
    });
}

function getIdLabelByName(name) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id_etiqueta FROM Etiquetas WHERE nombre = ?', name, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_label: result[0].id_etiqueta });
                } else {
                    resolve({ status: false });
                }
            }
        }));
    });
}

function createLabel(name) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Etiquetas (nombre, repeticiones) VALUES (?, 1)', name, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({ status: true, id_label: result[0].id_etiqueta });
                } else {
                    resolve({ status: false });
                }
            }
        }));
    });
}

function insertLabelPublicacion(id_label, id_publicacion) {
    conn.query('INSERT INTO Etiquetas_publicaciones (id_label, id_publicacion) VALUES (?, ?)',
        [id_label, id_publicacion], ((err) => {
            if (err) {
                reject(err);
            }
    }));
    conn.query('UPDATE Etiquetas SET repeticiones = repeticiones + 1 WHERE id_etiqueta = ?',
        id_label, ((err) => {
            if (err) {
                reject(err);
            }
    }));
}

//=================================== Comentario ============================================
function createComentario(comentario, id_publicacion, id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Comentario (comentario, id_usuario, id_publicacion) VALUES (?, ?, ?)',
            [comentario, id_usuario, id_publicacion], ((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ status: true, id_comentario: result.insertId });
            }
        }));
    });
}

function getComentarios(id_publicacion) {
    id_publicacion = `%${id_publicacion}%`;
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Comentario WHERE id_publicacion LIKE ?', [id_publicacion], (async (err, result) => {
            if (err) {
                console.log("error en la consulta a la db en consultar comentarios")
                reject(err);
            } else {
                //console.log("comentarios consultas bien", result)
                let comentarios = [];
                for (let comentario of result) {
                    comentarios.push({
                        id: comentario.id_comentario,
                        comentario: comentario.comentario,
                        fecha: comentario.fecha,
                        usuario: comentario.id_usuario
                    })
                }
                resolve({ status: true, 'comentarios': comentarios });
            }
        }));
    });
}

module.exports = { 
    getIdUsuario,
    getPasswordUsuario,
    registrarUsuario,
    createPublicacion,
    getPublicaciones,
    getIdLabelByName,
    createLabel,
    insertLabelPublicacion,
    createComentario
};