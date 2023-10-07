var AWS = require('aws-sdk');
const rekognition_keys = {
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
};
const rek = new AWS.Rekognition(rekognition_keys)

function compararFotos(fotoPrincipal, fotoComparacion) {
    var params = {
        SourceImage: {
            Bytes: Buffer.from(fotoPrincipal, 'base64')
        },
        TargetImage: {
            Bytes: Buffer.from(fotoComparacion, 'base64')
        },
        SimilarityThreshold: '85', // porcentaje para hacer en la comparacion, limite de similitud
    }
    return new Promise((resolve, reject) => {
        rek.compareFaces(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve({similarity: data.FaceMatches[0].Similarity});
            }
        })
    });
}

module.exports = { compararFotos }