const router = require('express').Router();
const { login, registro } = require('../controllers/cognito.controller');
const { compararFotos } = require('../controllers/rekognition.controller');
const { getImagen } = require('../controllers/s3.controller');
const { getIdUsuario, getCredencialesUsuario, getIdAllUsuarios } = require('../controllers/mysql.controller');
const crypto = require('crypto');
router.get('/', (req, res) => {
    res.status(200).json({ message: "API corriendo" });
});

router.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;
        const hash = crypto.createHash('sha256').update(password).digest('hex')
        const result = await login(user, hash);
        if (result.status) {
            const usuario = await getIdUsuario(user);
            if (usuario.status) {
                return res.status(200).json({ok: true, id_usuario: usuario.id_usuario, jwt: result.response.idToken.jwtToken});
            } else {
                console.log('Usuario no existe en la base de datos.');
            }
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

        const usuarios = await getIdAllUsuarios();
        let credenciales = null;
        let id_usuario = null;
        if (usuarios.length > 0) {
            for (let i = 0; i < usuarios.length; i++) {
                const fotoUsuario = await getImagen('usuarios/' + usuarios[i].id_usuario);
                const rekognition = await compararFotos(foto, fotoUsuario.image);
                if (rekognition.similarity > 85) {
                    credenciales = await getCredencialesUsuario(usuarios[i].id_usuario);
                    id_usuario = usuarios[i].id_usuario;
                    break;
                }
            }
            if (credenciales != null) {
                if (credenciales.status) {
                    const result = await login(credenciales.correo, credenciales.password);
                    if (result.status) {
                        return res.status(200).json({ok: true, id_usuario: id_usuario, jwt: result.response.idToken.jwtToken});
                    } else {
                        console.log('Usuario no existe en la base de datos.');
                    }
                } else {
                    console.log('Usuario no existe en la base de datos.');
                }
            }
        } else {
            console.log('No hay usuarios en la base de datos.');
        }
        
        console.log('El rostro no coincide con ningún usuario.');
        res.status(401).json({ok: false});
    } catch (error) {
        console.log(error);
        res.status(400).json({ok: false})
    }
    
});

router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, dpi, password, imagen } = req.body;
        if(nombre === '' || correo  === '' || dpi  === '' || password  === '' || imagen === '') res.status(400).json({ok : false, message : "Campos vacíos."})
        if(nombre || correo  || dpi  || password  || imagen){
        //Cognito
            const result = registro(nombre, correo, dpi, password, imagen)
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