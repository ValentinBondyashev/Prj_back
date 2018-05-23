// Initialize response helper;
const responseHelper = require('../helpers/response');

// Initialize models;
const Skills = require('../models/skills');
const UserSkills = require('../models/user-skills');

// Initialize skills class;
const skills = {};

// Method for get skills data;
skills.getSkills = function (request, response)
{
    // Create request query;
    let query = '';

    if (request.query['skillId'])
    {
        query =
            'SELECT userSkills.id, userSkills.userId, userSkills.skillId, skills.title AS skillTitle, ' +
            'skills.description AS skillDescription, skills.categoryId AS skillCategoryId, ' +
            'skillsCategories.title AS skillCategoryTitle, skillsCategories.description AS skillCategoryDescription, ' +
            'userSkills.mark, userSkills.disposition, userSkills.date ' +
            'FROM userSkills ' +
            'JOIN skills ' +
            'ON skills.id = userSkills.skillId ' +
            'JOIN skillsCategories ' +
            'ON skillsCategories.id = skills.categoryId ' +
            'WHERE userSkills.userId = "' + request['token']['user_id'] + '" ' +
            'AND userSkills.skillId = ' + request.query['skillId'];
    }
    else
    {
        query =
            'SELECT userSkills.id, userSkills.userId, userSkills.skillId, skills.title AS skillTitle, ' +
            'skills.description AS skillDescription, skills.categoryId AS skillCategoryId, ' +
            'skillsCategories.title AS skillCategoryTitle, skillsCategories.description AS skillCategoryDescription, ' +
            'userSkills.mark, userSkills.disposition, userSkills.date ' +
            'FROM userSkills ' +
            'JOIN skills ' +
            'ON skills.id = userSkills.skillId ' +
            'JOIN skillsCategories ' +
            'ON skillsCategories.id = skills.categoryId ' +
            'WHERE userSkills.date = (' +
            'SELECT MAX(us.date) ' +
            'FROM userSkills AS us ' +
            'WHERE us.userId = "' + request['token']['user_id'] + '" ' +
            'AND us.skillId = userSkills.skillId) ' +
            'GROUP BY userSkills.skillId';
    }

    // Send query and generate response;
    sequelize.query(query).then((userSkills) =>
    {
        response.status(200);
        responseHelper.setResponseData(userSkills[0]);
        responseHelper.sendResponse(response);
    });
};

// Method for add skills;
skills.addSkills = function (request, response)
{
    // Check request data;
    if (!request['body']['mark'] || (request['body']['mark'] < 0 || request['body']['mark'] > 10))
    {
        response.status(400);
        responseHelper.setResponseError('Mark must have value from 0 to 10!');
        responseHelper.sendResponse(response);

        return;
    }

    if (!request['body']['disposition'] || (request['body']['disposition'] < 0 || request['body']['disposition'] > 10))
    {
        response.status(400);
        responseHelper.setResponseError('Disposition must have value from 0 to 10!');
        responseHelper.sendResponse(response);

        return;
    }

    // Set user id from token;
    request['body']['userId'] = request['token']['user_id'];

    // Try create new skill;
    UserSkills.create(request['body']).then((data) =>
    {
        response.status(200);
        responseHelper.setResponseData({ 'id': data['dataValues']['id'] });
        responseHelper.sendResponse(response);
    }).catch((error) =>
    {
        response.status(400);
        responseHelper.setResponseError(error.message);
        responseHelper.sendResponse(response);
    });
};

// Method for get skills list data;
skills.getSkillsList = function (request, response)
{
    Skills.findAll().then((skills) =>
    {
        response.status(200);
        responseHelper.setResponseData(skills);
        responseHelper.sendResponse(response);
    });
};

// Export router;
module.exports = skills;