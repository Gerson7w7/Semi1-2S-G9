const router = require('express').Router();
const { login, registro } = require('../controllers/cognito.controller');
const { compararFotos } = require('../controllers/rekognition.controller');
const { getImagen } = require('../controllers/s3.controller');
const { getIdUsuario, getPasswordUsuario } = require('../controllers/mysql.controller');
const crypto = require('crypto');
const sha256 = require('js-sha256');

router.get('/', (req, res) => {
    res.status(200).json({ message: "API corriendo" });
});

router.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;
        const hash = crypto.createHash('sha256').update(password).digest('hex')
        const result = await login(user, hash);
        if (result.status) {
            return res.status(200).json({ok: true, jwt: result.response.idToken.jwtToken});
        } else {
            if (result.error.code == 'UserNotConfirmedException') {
                console.log("Debe verificar su correo antes de iniciar sesión");
            } else {
                console.log(result.error);
            }
        }
        res.status(401).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
    
});

router.post('/login-facial', async (req, res) => {
    try {
        const { user, foto } = req.body;
        const usuario = getIdUsuario(user);
        if (usuario.status) {
            const fotoUsuario = await getImagen('usuarios/' + usuario.id_usuario);
            const rekognition = await compararFotos(foto, fotoUsuario.image);
            if (rekognition.similarity > 85) {
                const pass = await getPasswordUsuario(usuario.id_usuario);
                if (pass.status) {
                    const result = await login(user, pass.password);
                    if (result.status) {
                        return res.status(200).json({ok: true, jwt: result.response.idToken.jwtToken});
                    } else {
                        if (result.error.code == 'UserNotConfirmedException') {
                            console.log("Debe verificar su correo antes de iniciar sesión");
                        } else {
                            console.log(result.error);
                        }
                    }
                } else {
                    console.log('No existe el usuario en la base de datos.');
                }
            } else {
                console.log('El rostro no coincide con el usuario.');
            }
        } else {
            console.log('Usuario no existe en la base de datos.');
        }
        res.status(401).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
    
});

router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, dpi, password, imagen } = req.body;
        const passwordSha = sha256(password);
        console.log("contraseña encriptada ", passwordSha)
        if(nombre === '' || correo  === '' || dpi  === '' || passwordSha  === '' || imagen === '') res.status(400).json({ok : false, message : "Campos vacíos."})
        if(nombre || correo  || dpi  || passwordSha  || imagen){
        //Cognito
            const result = await registro(nombre, correo, dpi, passwordSha, imagen)
            console.log(result)
            if(result)
                res.status(200).json({ok : true, message : "Usuario registrado con éxito."})
            else
                res.status(400).json({ok : false, message : "Error al registrar usuario."})
        
        }else {
            res.status(400).json({ok : false, message : "Campos undefined."})
        }      

    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
});

module.exports = router;