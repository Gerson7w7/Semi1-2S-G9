const router = require('express').Router();
const { login } = require('../controllers/cognito.controller');
const { getIdUsuario } = require('../controllers/mysql.controller');

router.get('/', (req, res) => {
    res.status(200).json({ message: "API corriendo" });
});

router.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;
        
        const result = await login(user, password);
        if (result.status) {
            const usuario = await getIdUsuario(user);
            if (usuario.status) {
                //Manejar id usuario o jwt que devuelve cognito?
                return res.status(200).json({ok: true, id_usuario: usuario.id_usuario});
            } else {
                console.log('Usuario no existe en la base de datos.');
            }
            console.log(result.response)
        } else {
            console.log(result.error);
        }
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