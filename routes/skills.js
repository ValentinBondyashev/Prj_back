// Initialize response helper;
const responseHelper = require('../helpers/response');

// Initialize models;
const Skills = require('../models/skills');
const UserSkills = require('../models/user-skills.js');

// Initialize skills class;
const skills = {};

// Method for get skills data;
skills.getSkills = function(request, response)
{

};

// Method for get skills list data;
skills.getSkillsList = function(request, response)
{
    Skills.findAll().then((skillsData) =>
    {
        responseHelper.setResponseData(skillsData);
        responseHelper.sendResponse(response);
    });
};

// Export router;
module.exports = skills;