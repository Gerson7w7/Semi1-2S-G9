var AWS = require('aws-sdk');

const rek = new AWS.Rekognition(aws_keys.rekognition)

function compararFotos(fotoPrincipal, fotoComparacion) {
    var params = {
        SourceImage: {
            Bytes: Buffer.from(fotoPrincipal, 'base64')
        },
        TargetImage: {
            Bytes: Buffer.from(fotoComparacion, 'base64')
        },
        SimilarityThreshold: '80', // porcentaje para hacer en la comparacion, limite de similitud
    }
    rek.compareFaces(params, function (err, data) {
        if (err) {
            throw err;
        } else {
            return data.FaceMatches;
        }
    })
}

module.exports = { compararFotos }