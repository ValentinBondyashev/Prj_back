// Initialize response helper;
const responseHelper = require('../helpers/response');

const test = {};


test.test = function (request, response)
{
    response.status(200);
    responseHelper.setResponseData("asdasdsad");
    responseHelper.sendResponse(response);
}
// Export router;
module.exports = test;