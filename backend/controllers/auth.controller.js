const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if(!token){
        return res.status(401).json({ok: false, message: 'No token provided.'});
    }
    const bearer = token.split(' ')[1]; // obtenemos la parte del token que nos interesa
    // Bearer "ASLDKFJALSDKFJ"
    jwt.verify(bearer, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message: 'Invalid token'});
        }
        req.UserId = decoded.User; // decodeamos el token y obtenemos el id del usuario
        next();
    
    });
}

module.exports = { verifyToken };