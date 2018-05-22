// Initialize firebase;
const firebase = require('firebase-admin');

// Initialize response helper;
const responseHelper = require('../helpers/response');

// Method handler for intercept request with auth;
function auth(request, response, next)
{
    if (!request.headers['Bearer'])
    {
        responseHelper.setResponseError('Token does not exist!');
        responseHelper.sendResponse(response);
    }
    else
    {
        firebase.auth().verifyIdToken(request.headers['Bearer']).then((token) =>
        {
            request.token = token;
            next();
        }).catch((error) =>
        {
            responseHelper.setResponseError('Token is invalid!');
            responseHelper.sendResponse(response);
        });
    }
}

// Export auth interceptor handler;
module.exports = auth;