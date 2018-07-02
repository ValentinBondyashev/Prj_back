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
const User = globalModel.users;
const Joi = require('joi');
const SkillsSchema = require('./../Validators/SkillsSchema');


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

    let users = await User.findAll();

    response.send(users);
};


// Method for get skills data;
skills.getSkills = async function (request, response)
{
    // Create request query;
    let query = '';
    let userId = request.params.id
    if(!request.params.id) {

        response.status(400);
        response.send({success:false,error:"Please set a user_id"});

        return;
    }

    // if (request.query['skillId'])
    // {
    //     query =
    //         'SELECT userSkills.id, userSkills.userId, userSkills.skillId, skills.title AS skillTitle, ' +
    //         'skills.description AS skillDescription, skills.categoryId AS skillCategoryId, ' +
    //         'skillsCategories.title AS skillCategoryTitle, skillsCategories.description AS skillCategoryDescription, ' +
    //         'userSkills.mark, userSkills.disposition, userSkills.comment, userSkills.date ' +
    //         'FROM userSkills ' +
    //         'JOIN skills ' +
    //         'ON skills.id = userSkills.skillId ' +
    //         'JOIN skillsCategories ' +
    //         'ON skillsCategories.id = skills.categoryId ' +
    //         'WHERE userSkills.userId = "' + userId + '" ' +
    //         'AND userSkills.skillId = ' + request.query['skillId'] + ' ' +
    //         'ORDER BY skills.categoryId';
    // }
    // else
    // {
    //     query =
    //         'SELECT userSkills.id, userSkills.userId, userSkills.skillId, skills.title AS skillTitle, ' +
    //         'skills.description AS skillDescription, skills.categoryId AS skillCategoryId, ' +
    //         'skillsCategories.title AS skillCategoryTitle, skillsCategories.description AS skillCategoryDescription, ' +
    //         'userSkills.mark, userSkills.disposition, userSkills.comment, userSkills.date ' +
    //         'FROM userSkills ' +
    //         'JOIN skills ' +
    //         'ON skills.id = userSkills.skillId ' +
    //         'JOIN skillsCategories ' +
    //         'ON skillsCategories.id = skills.categoryId ' +
    //         'WHERE userSkills.date = (' +
    //         'SELECT MAX(us.date) ' +
    //         'FROM userSkills AS us ' +
    //         'WHERE userSkills.userId = "' + userId + '" ' +
    //         'AND userSkills.skillId = userSkills.skillId ) ' +
    //         'GROUP BY userSkills.skillId ' +
    //         'ORDER BY skills.categoryId';
    //
    // }


    if(request.query['skillId'])
    {

        var where = {
            userId:userId,
            skillId:request.query['skillId']
        }
        
    }else{
        var where = {
            userId:userId
        }
    }

        UserSkills.findAll({
            where:where,
            include: [
                {model:Skills, include:[SkillsCategories]},
                {model:User}
            ]
        })
        .then(skills => {
            response.send(skills);
        })
        .catch(E => {
            response.status(400);
            response.send(E);
        });
};



// Method for add skills;
skills.addSkills = async function (request, response)
{

    // Check request data;
    Joi.validate(request.body,SkillsSchema.add, async function(Error,Data){
        if(!Error)
        {
                // Try create or update skill;
                let userSkills = await UserSkills.findOne({
                    where: {
                        userId: request['body']['userId'],
                        skillId: request['body']['skillId']
                    },
                    include:[
                        {model:Skills,include:[SkillsCategories]},
                        {model:User}
                    ]
                });

                if(userSkills && userSkills.mark !== Data.mark)
                {
                    skillLogs.create({
                        userId:userSkills.userId,
                        skillId:userSkills.id,
                        skill_old: userSkills.mark,
                        skill_new: Data.mark
                    });

                    if(Data.disposition)
                    {
                        var update = {
                            mark:Data.mark,
                            disposition: Data.disposition
                        }
                    }else{
                        var update = {
                            mark:Data.mark,
                        }
                    }

                    userSkills.update(update);
                    Emitter.emit('update_skill');
                    response.send(userSkills);

                }else{
                    response.status(400);
                    response.send({
                        success:false,
                        message:'Such skill for this user does not exist or updates a same value'
                    });
                }


        }else{
            response.send({success:false,error:Error});
            response.send(Error);
        }
    });
    return;

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
        response.send(res);
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