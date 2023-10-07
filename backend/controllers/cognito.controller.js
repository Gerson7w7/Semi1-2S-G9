const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' }); // Reemplaza 'tu-region' con la región de tu User Pool.

const crypto = require('crypto');
const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID
};

function registro(nombre, correo, dpi, password, foto) {

    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID, // Reemplaza 'tu-app-client-id' con el ID de tu cliente de aplicación.
        Username: correo,
        Password: password,
        UserAttributes: [
          {
            Name: 'name',
            Value: nombre,
          },
          {
            Name: 'email',
            Value: correo,
          },
          {
            Name: 'nickname',
            Value: dpi,
          },
          {
            Name: 'picture',
            Value: foto,
          },
          // Puedes agregar más atributos personalizados aquí si es necesario.
        ],
      };
    
      try {
        return cognito.signUp(params).promise();
      } catch (error) {
        console.error('Error al registrar usuario en Cognito', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error al registrar usuario' }),
        };
      }
    
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