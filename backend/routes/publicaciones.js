const router = require('express').Router();

router.post('/crear-publicacion', (req, res) => {
    res.status(200).json({ message: "API corriendo" });
});

module.exports = router;