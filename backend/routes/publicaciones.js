const router = require('express').Router();
const { createPublicacion, getPublicaciones, createComentario } = require('../controllers/mysql.controller');
const { guardarImagen } = require('../controllers/s3.controller');

router.post('/crear-publicacion', async (req, res) => {
    try {
        const { imagen, descripcion, id_usuario } = req.body;
        const result = await createPublicacion(descripcion, id_usuario);
        if (result.status) {
            await guardarImagen('publicaciones/' + result.id_publicacion, imagen);
            return res.status(200).json({ ok: true });
        }
        console.log('Error al crear publicación.');
        res.status(400).json({ok : false, mensaje : "Error al crear publicación."})
    } catch (error) {
        console.log(error);
        res.status(400).json({ok : false, mensaje : "Error al crear publicación."})
    }
});

router.get('/get-publicaciones', async (req, res) =>{
    try {
        const { id_usuario } = req.body;
        console.log("id de usuario ", id_usuario)
        const result = await getPublicaciones(id_usuario);
        if (result) {
            return res.status(200).json({ ok: true, publicaciones: result.publicaciones });
        }
        console.log('Error al consultar publicación.');
        res.status(400).json({ok : false, mensaje : "Error al consultar publicación."})
    } catch (error) {
        console.log(error);
        res.status(400).json({ok : false, mensaje : "Error al consultar publicación."})
    }
});

router.post('/add-comentario', async (req, res) =>{
    try {
        const {comentario, id_publicacion, id_usuario } = req.body;
        console.log("id de usuario en comentario", id_usuario)
        const result = await createComentario(comentario, id_publicacion, id_usuario);
        if (result) {
            return res.status(200).json({ ok: true, id_comentario: result.id_comentario });
        }
        console.log('Error al crear comentario.');
        res.status(400).json({ok : false, mensaje : "Error al crear comentario."})
    } catch (error) {
        console.log(error);
        res.status(400).json({ok : false, mensaje : "Error al crear comentario."})
    }
});

module.exports = router;