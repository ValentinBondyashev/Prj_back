// Initialize response helper;
const responseHelper = require('../../helpers/response');
// Initialize models;
const globalModel =  require('./../Models/index');
const Skills = globalModel.skills;
const UserSkills = globalModel.userSkills;
const SkillsCategories = globalModel.skillsCategories;
const Admins = globalModel.admins;
const skillLogs = globalModel.user_skills_logs;
const sequelize = globalModel.sequelize;
const Sequelize = globalModel.Sequelize;
const Emitter = require('./../Events/OnSkillUpdate');
// Initialize skills class;
const skills = {};
// Initialize firebase;
const firebase = require('firebase-admin');


// Get All Users
skills.checkAdmin = async function (request, response)
{
    
    let admin = await Admins.findAll({
        where: {
            admin_firebase_id: request['token']['user_id']
        }
    });

    if(admin.length == 0) {
        response.status(200);
        responseHelper.setResponseError({isAdmin: false});
        responseHelper.sendResponse(response);
    } else {
        response.status(200);
        responseHelper.setResponseError({isAdmin: true});
        responseHelper.sendResponse(response);
    }

   
     
}

// Get All Users
skills.getAllUsers = async function (request, response)
{
    
    let admin = await Admins.findAll({
        where: {
            admin_firebase_id: request['token']['user_id']
        }
    });

    if(admin.length == 0) {
        response.status(403);
        responseHelper.setResponseError('No access!');
        responseHelper.sendResponse(response);
    }

    firebase.auth().listUsers(1000).then((listUsersResult) => {
        response.status(200);
        responseHelper.setResponseData(listUsersResult);
        responseHelper.sendResponse(response);
    });
     
}


// Method for get skills data;
skills.getSkills = async function (request, response)
{
    // Create request query;
    let query = '';
    
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
        }
    }

    if (request.query['skillId'])
    {
        query =
            'SELECT userSkills.id, userSkills.userId, userSkills.skillId, skills.title AS skillTitle, ' +
            'skills.description AS skillDescription, skills.categoryId AS skillCategoryId, ' +
            'skillsCategories.title AS skillCategoryTitle, skillsCategories.description AS skillCategoryDescription, ' +
            'userSkills.mark, userSkills.disposition, userSkills.comment, userSkills.date ' +
            'FROM userSkills ' +
            'JOIN skills ' +
            'ON skills.id = userSkills.skillId ' +
            'JOIN skillsCategories ' +
            'ON skillsCategories.id = skills.categoryId ' +
            'WHERE userSkills.userId = "' + (request.query['user_id'] == undefined ? request['token']['user_id'] :  request.query['user_id']) + '" ' +
            'AND userSkills.skillId = ' + request.query['skillId'] + ' ' +
            'ORDER BY skills.categoryId';
    }
    else
    {
        query =
            'SELECT userSkills.id, userSkills.userId, userSkills.skillId, skills.title AS skillTitle, ' +
            'skills.description AS skillDescription, skills.categoryId AS skillCategoryId, ' +
            'skillsCategories.title AS skillCategoryTitle, skillsCategories.description AS skillCategoryDescription, ' +
            'userSkills.mark, userSkills.disposition, userSkills.comment, userSkills.date ' +
            'FROM userSkills ' +
            'JOIN skills ' +
            'ON skills.id = userSkills.skillId ' +
            'JOIN skillsCategories ' +
            'ON skillsCategories.id = skills.categoryId ' +
            'WHERE userSkills.date = (' +
            'SELECT MAX(us.date) ' +
            'FROM userSkills AS us ' +
            'WHERE userSkills.userId = "' + (request.query['user_id'] == undefined ? request['token']['user_id'] : request.query['user_id']) + '" ' +
            'AND userSkills.skillId = userSkills.skillId ) ' +
            'GROUP BY userSkills.skillId ' +
            'ORDER BY skills.categoryId';
       
    }

    // Send query and generate response;
    let userSkills = await sequelize.query(query);

    if (userSkills[0].length == 0) {
        let skills = await Skills.findAll();
        
        
        let queryString = "";
        for(let i=0; i < skills.length; i++) {
            queryString = queryString + `('${request.query['user_id'] == undefined ? request['token']['user_id'] :  request.query['user_id']}', 1, 1, '', CURDATE() ,${skills[i]['id']}), `;
        }
       
        queryString = queryString.slice(0,-2);
        queryString += ';';

        queryString = "INSERT INTO userSkills (userId, mark, disposition, comment, date ,skillId) VALUES " + queryString;

        let res = await sequelize.query(queryString);

        userSkills = await sequelize.query(query);

        response.status(200);
        responseHelper.setResponseData(userSkills[0]);
        responseHelper.sendResponse(response);

    } else {
        response.status(200);
        responseHelper.setResponseData(userSkills[0]);
        responseHelper.sendResponse(response);
    }
};


skills.updateSkill = async function(request, response)
{

};

// Method for add skills;
skills.addSkills = async function (request, response)
{

    console.log("TOKEN ------------> ", request['token']['user_id']);
    // Check request data;
    if (!request['body']['mark'] || (request['body']['mark'] < -1 || request['body']['mark'] > 10))
    {
        response.status(400);
        responseHelper.setResponseError('Mark must have value from 0 to 10!');
        responseHelper.sendResponse(response);

        return;
    }
    console.log(request['body']['disposition']);
    if (request['body']['disposition'] === undefined || (request['body']['disposition'] < -1 || request['body']['disposition'] > 10))
    {
        response.status(400);
        responseHelper.setResponseError('Disposition must have value from 0 to 10!');
        responseHelper.sendResponse(response);

        return;
    }

    // Set user id from token;
    request['body']['userId'] = request.query['user_id'] == undefined ? request['token']['user_id'] :  request.query['user_id'];

    // Remove unwanted data from request data;
    delete request['body']['id'];
    delete request['body']['date'];

    // Try create or update skill;
    let userSkills = await UserSkills.findOne({
        where: {
            userId: request['body']['userId'],
            skillId: request['body']['skillId']
        }
    });

    if(userSkills)
    {
        skillLogs.create({
            userId:userSkills.userId,
            skillId:userSkills.id,
            skill_old: userSkills.mark,
            skill_new: request.body.mark
        });

        userSkills.update({
            mark:request.body.mark
        });
        Emitter.emit('update_skill');
        response.send(userSkills);
    }else{
        response.status(400);
        resposne.send({
            success:false,
            message:'Such skill for this user does not exist'
        });
    }


};

skills.getSkillsList = function (request, response)
{
    Skills.findAll().then((skills) =>
    {
        response.status(200);
        responseHelper.setResponseData(skills);
        responseHelper.sendResponse(response);
    });
};

skills.createNewSkill = async function (request, response) 
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
        }
    }
    let skillTitle = request['body']['skillTitle'];

    try {
        let needSkill = await Skills.find({
            where: {
                title: skillTitle
            }
        });
        let skill = {};
        if(needSkill == null) {
            let newSkill = {
                title: skillTitle,
                description: "",
                categoryId: request['body']['categoryId']
            };
            skill = await Skills.create(newSkill);
        } else {
            skill = await Skills.find({
                id: needSkill['id']
            });
        }

        let newSkill = await UserSkills.create({
            userId: request.query['user_id'] == undefined ? request['token']['user_id'] :  request.query['user_id'],
            mark: request['body']['mark'] ,
            disposition: request['body']['disposition'],
            comment: request['body']['comment'],
            skillId: skill['id']
        });
        response.status(200);
        responseHelper.setResponseData(newSkill);
        responseHelper.sendResponse(response);

    } catch (error) {
        response.status(500);
        responseHelper.sendResponse(response);
    }
}

skills.getCategoriesSkills = async function (request, response) 
{
    try {
        let res = await SkillsCategories.findAll();
        response.status(200);
        responseHelper.setResponseData(res);
        responseHelper.sendResponse(response);
    } catch (error) {
        response.status(500);
        responseHelper.sendResponse(response);
    }
    
};

skills.getSkillsLogs = async function()
{
    var logSkills = await skillLogs.findAll({
       order:[
           ['updatedAt','DESC']
       ],
        raw: true,
        include:[UserSkills]
    });

    return JSON.stringify(logSkills);
};

// Export router;
module.exports = skills;