const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const crypto = require('crypto');
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

function login(correo, password) {
    const hash = crypto.createHash('sha256').update(password).digest('hex')
    const authenticationData = {
        Username: correo,
        Password: hash + 'D**'
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var userData = {
        Username: correo,
        Pool: cognito
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // User authentication was successful
            return result;
        },
        onFailure: function (err) {
            // User authentication was not successful
            throw err
        },
        mfaRequired: function (codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            cognitoUser.sendMFACode(verificationCode, this)
        },
    });
}

module.exports = { registro, login };