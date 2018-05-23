// Initialize firebase;
const firebase = require('firebase-admin');

// Initialize response helper;
const responseHelper = require('../helpers/response');

// Method handler for intercept request with auth;
function auth(request, response, next)
{
    if (!request.headers['bearer'])
    {
        response.status(400);
        responseHelper.setResponseError('Token does not exist!');
        responseHelper.sendResponse(response);
    }
    else
    {
        firebase.auth().verifyIdToken(request.headers['bearer']).then((token) =>
        {
            request.token = token;
            next();
        }).catch((error) =>
        {
            response.status(401);
            responseHelper.setResponseError(error['message']);
            responseHelper.sendResponse(response);
        });
    }
}

// Export auth interceptor handler;
module.exports = auth;