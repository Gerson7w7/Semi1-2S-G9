const router = require('express').Router();
const sha256 = require('js-sha256');
const { login } = require('../controllers/cognito.controller');

router.get('/', (req, res) => {
    res.status(200).json({ message: "API corriendo" });
});

router.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;
        //Cognito
        const result = login(user, pass);
        console.log(result);
        if (result.status) {
            //Consultar mysql para obtener id_usuario
            return res.status(200).json({ok: true, id_usuario: result.id_usuario});
        }
        console.log('Correo y/o contraseña incorrectos.')
        res.status(401).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
    
});

router.post('/login-facial', async (req, res) => {
    try {
        const foto = req.body.foto;
        //Uso de Cognito y Rekognition
        
        if (result.status) {
            return res.status(200).json({ok: true, id_usuario: result.id_usuario});
        }
        console.log('Rostro incorrecto.')
        res.status(401).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
    
});

router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, dpi, password, foto } = req.body;
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

module.exports = router;