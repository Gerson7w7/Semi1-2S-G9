require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const index = require('./routes/index');
const publicaciones = require('./routes/publicaciones');

const app = express();

app.set('port', 2000);
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.set('json spaces', 2);

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use('/', index);
app.use('/publicaciones', publicaciones);

app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});