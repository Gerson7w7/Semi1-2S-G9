const router = require('express').Router();
const { createPublicacion, getPublicaciones, getIdLabelByName,
        createLabel, insertLabelPublicacion, getLabels, createComentario } = require('../controllers/mysql.controller');
const { detectLabels } = require('../controllers/rekognition.controller');
const { guardarImagen } = require('../controllers/s3.controller');

router.post('/crear-publicacion', async (req, res) => {
    try {
        const { imagen, descripcion, id_usuario } = req.body;
        const result = await createPublicacion(descripcion, id_usuario);
        if (result.status) {
            const labels = await detectLabels(imagen);
            if (labels.length > 0) {
                for (let label of labels) {
                    const existente = await getIdLabelByName(label);
                    if (existente.status) {
                        insertLabelPublicacion(existente.id_label, result.id_publicacion);
                    } else {
                        const newLabel = await createLabel(label);
                        if (newLabel.status) {
                            insertLabelPublicacion(newLabel.id_label, result.id_publicacion);
                        }
                    }
                }
            }
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
        const labels = await getLabels();
        const result = await getPublicaciones(id_usuario);
        if (result) {
            return res.status(200).json({ ok: true, etiquetas: labels.labels, publicaciones: result.publicaciones });
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

router.post('/filtrar-publicaciones', async (req, res) => {
    try {
        const { etiqueta, id_usuario } = req.body;
        /*const result = await createComentario(comentario, id_publicacion, id_usuario);
        if (result) {
            return res.status(200).json({ ok: true, id_comentario: result.id_comentario });
        }*/
        console.log('Error al filtrar publicaciones.');
        res.status(400).json({ok : false, mensaje : "Error al filtrar publicaciones."});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok : false, mensaje : "Error al filtrar publicaciones."});
    }
});

module.exports = router;