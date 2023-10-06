const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID
};
const cognito = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function registro(nombre, correo, dpi, password, foto) {
    let attributeList = [];

    const dataNombre = {
        Name: 'nombre',
        Value: nombre  
    };

    const dataDpi = {
        Name: 'dpi',
        Value: dpi
    };

    const dataFoto = {
        Name: 'foto',
        Value: foto  
    };

    const attributeNombre = new AmazonCognitoIdentity.CognitoUserAttribute(dataNombre);
    const attributeDpi = new AmazonCognitoIdentity.CognitoUserAttribute(dataDpi);
    const attributeFoto = new AmazonCognitoIdentity.CognitoUserAttribute(dataFoto);

    attributeList.push(attributeNombre);
    attributeList.push(attributeDpi);
    attributeList.push(attributeFoto);
    
    const hash = crypto.createHash('sha256').update(password).digest('hex')

    cognito.signUp(correo, hash + 'D**', attributeList, null, async(err, data) => {
        if (err) {
            throw err;
        } else {
            console.log(data);
        }
    });
}

async function login(correo, password) {
    const authenticationData = {
        Username: correo,
        Password: password
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var userData = {
        Username: correo,
        Pool: cognito
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                // User authentication was successful
                resolve({status: true, response: result});
            },
            onFailure: function (err) {
                // User authentication was not successful
                resolve({status: false, error: "Usuario y/o contraseña incorrectos."});
            },
            mfaRequired: function (codeDeliveryDetails) {
                // MFA is required to complete user authentication.
                // Get the code from user and call
                cognitoUser.sendMFACode(verificationCode, this);
                resolve({status: false, error: "MFA requerido."});
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.
                resolve({status: false, error: "Es necesario cambiar la contraseña."});
            }
        });
    });
}

module.exports = { registro, login };