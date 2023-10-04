const router = require('express').Router();
const { createPublicacion } = require('../controllers/mysql.controller');
const { guardarImagen } = require('../controllers/s3.controller');

router.post('/crear-publicacion', async (req, res) => {
    try {
        const { imagen, descripcion, id_usuario } = req.body;
        const result = await createPublicacion(descripcion, id_usuario);
        if (result.status) {
            guardarImagen('publicaciones/' + result.id_publicacion, imagen);
            return res.status(200).json({ ok: true });
        }
        console.log('Error al crear publicación.');
        res.status(400).json({ ok: false });
    } catch (error) {
        console.log(error);
        res.status(400).json({ ok: false });
    }
});

module.exports = router;