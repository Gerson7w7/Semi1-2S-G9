const conn = require('../database/conexion.js');
const { getImagen } = require('./s3.controller.js');
const prefijoBucket = process.env.PREFIJO_BUCKET;

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

function getNombreUsuario(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT nombre FROM Usuarios WHERE id_usuario = ?', id_usuario, ((err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(result[0].nombre);
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

//============================================= PERFIL =============================================
function getPerfil(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT nombre, correo, dpi FROM Usuarios WHERE id_usuario = ?',
            id_usuario, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve({
                        status: true,
                        nombre: result[0].nombre,
                        email: result[0].correo,
                        dpi: result[0].dpi.toString(),
                        imagen: `${prefijoBucket}Fotos/usuarios/${id_usuario}.jpg`
                    });
                } else {
                    resolve({ status: false })
                }
            }
        }));
    });
}

function editarPerfil(id_usuario, nombre, dpi, correo) {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Usuarios
                    SET nombre = CASE WHEN LENGTH(?) > 0 THEN ? ELSE nombres END,
                    dpi = CASE WHEN LENGTH(?) > 0 THEN ? ELSE dpi END,
                    correo = CASE WHEN LENGTH(?) > 0 THEN ? ELSE correo END
                    WHERE id_usuario = ?`,
                    [nombre, nombre, dpi, dpi, correo, correo, id_usuario], (async (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.changedRows > 0) {
                    resolve({ status: true })
                } else {
                    resolve({ status: false })
                }
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
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Publicaciones', (async (err, result) => {
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

function getPublicacionesByLabel(id_usuario, label) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Publicaciones p
                    RIGHT JOIN Etiquetas_publicaciones ep ON ep.id_publicacion = p.id_publicacion
                    LEFT JOIN Etiquetas e ON e.id_etiqueta = ep.id_etiqueta
                    WHERE e.nombre = ?`, label, (async (err, result) => {
            if (err) {
                reject(err);
            } else {
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

function getLabels() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT nombre FROM Etiquetas ORDER BY repeticiones DESC LIMIT 10', ((err, result) => {
            if (err) {
                reject(err);
            } else {
                stringArray = result.map(label => label.nombre);
                stringArray.unshift("Todos");
                resolve({ labels: stringArray });
            }
        }));
    });
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

//=================================== Amigos ============================================
function agregarAmigo(estado, id_amigo, id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Amigo (estado, usuario_id1, usuario_id2) VALUES (?, ?, ?)',
            [estado, id_usuario, id_amigo], ((err, result) => {
            if (err) {
                console.log("Error amigos bd", err)
                reject(err);
            } else {
                console.log("Result amigos bd", result)
                resolve({ status: true, message: "Agregado, espera aceptación" });
            }
        }));
    });
}

function aceptarAmigo(estado, id_amigo, id_usuario) {
    return new Promise((resolve, reject) => {
        // OR (usuario_id1 = ? AND usuario_id2 = ?)
        conn.query('UPDATE Amigo SET estado = ? WHERE (usuario_id1 = ? AND usuario_id2 = ?)',
            [estado, id_amigo, id_usuario], (err, result) => {
            if (err) {
                console.log("Error aceptar amigos bd", err);
                reject(err);
            } else {
                console.log("Result aceptar amigos bd", result);
                resolve({ status: true, message: "Agregado" });
            }
        });
    });
}


async function getFriends(id_usuario) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Amigo WHERE usuario_id1 = ? OR usuario_id2 = ?', [id_usuario, id_usuario], (async (err, result) => {
            if (err) {
                console.log("error en la consulta a la db en consultar amigos")
                reject(err);
            } else {
                console.log("amigos consultas coincidencia", result)
                let amigos = [];
                let mis_amigos = [];
                for (let amigo of result) {
                    real_id = amigo.id_usuario1 === id_usuario ? amigo.usuario_id2 : amigo.usuario_id1
                    amigos.push({
                        id: real_id,
                        estado: amigo.estado,
                        Nombre: await getNombreUsuario(real_id),
                        imagen : `${process.env.PREFIJO_BUCKET}Fotos/usuarios/${real_id}.jpg`
                    })
                    mis_amigos.push(real_id)
                }
                mis_amigos.push(id_usuario)
                not_amigos =  mis_amigos.length !== 0 ? await getNoFriends(mis_amigos) : []
                resolve({ status: true, 'amigos': amigos, not_amigos });
            }
        }));
    });
}

function getNoFriends(idUsuariosAmigos) {
    console.log("encontrados  ", idUsuariosAmigos)
    return new Promise((resolve, reject) => {
        const query = 'SELECT id_usuario, nombre FROM Usuarios WHERE id_usuario NOT IN (?)';
        conn.query(query, [idUsuariosAmigos], (err, results) => {
            if (err) {
                console.log("Error al obtener usuarios no amigos", err);
                reject(err);
            } else {
                
                let noAmigos = [];
                for (let amigo of results) {
                    noAmigos.push({
                        id: amigo.id_usuario,
                        Nombre: amigo.nombre,
                        imagen : `${process.env.PREFIJO_BUCKET}Fotos/usuarios/${amigo.id_usuario}.jpg`
                    })
                }
                resolve(noAmigos);
            }
        });
    });
}

function getAllFriends() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Amigo', (async (err, result) => {
            if (err) {
                console.log("error en la consulta a la db en consultar amigos")
                reject(err);
            } else {
                //console.log("amigos consultas bien", result)
                let amigos = [];
                let mis_amigos = [];
                for (let amigo of result) {
                    amigos.push({
                        usuario_id1: amigo.id_usuario1,
                        usuario_id2: amigo.id_usuario2,
                        estado: amigo.estado,
                    })
                    mis_amigos.push(amigo.id_usuario2)
                }
                resolve(mis_amigos);
            }
        }));
    });
}


module.exports = { 
    getIdUsuario,
    getPasswordUsuario,
    getPerfil,
    editarPerfil,
    registrarUsuario,
    createPublicacion,
    getPublicaciones,
    getPublicacionesByLabel,
    getIdLabelByName,
    createLabel,
    insertLabelPublicacion,
    getLabels,
    createComentario,
    agregarAmigo,
    aceptarAmigo,
    getFriends
};