// Initialize firebase;
const firebase = require('firebase-admin');

// Initialize response helper;
const responseHelper = require('./../../helpers/response');
const globalModel =  require('./../Models/index');
const Admins = globalModel.admins;

const authMiddleware = {
    // Method handler for intercept request with auth;
    auth: function (request, response, next)
    {
        if (!request.headers['authorization'])
        {
            response.status(400);
            responseHelper.setResponseError('Token does not exist!');
            responseHelper.sendResponse(response);
        }
        else
        {
            firebase.auth().verifyIdToken(request.headers['authorization'].replace('Bearer ', '')).then((token) =>
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
    },

    admin:async function (request, response, next)
    {
        if(request.query['user_id']) {
            let admin = await Admins.findAll({
                where: {
                    admin_firebase_id: request['token']['user_id']
                }
            });

            if(admin.length == 0) {
                response.status(403);
                responseHelper.setResponseError('No access!');
                responseHelper.sendResponse(response);
            }else{
                next();
            }
        }
    }

};


// Export auth interceptor handler;
module.exports = authMiddleware;