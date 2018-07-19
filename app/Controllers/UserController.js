const GlobalModel = require('./../Models/index');
/*
 	MODELS
*/
const User = GlobalModel.users;
const Skill = GlobalModel.skills;
const UserSkill = GlobalModel.userSkills;
const SkillCategory = GlobalModel.skillsCategories;
const SkillLogs = GlobalModel.user_skills_logs;

/*
	VALIDATORS
*/
const UserSchemas = require('./../Validators/UserSchema');
const Joi = require('joi');

/*
	JWT AND LIBS
*/
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = {

	login:function(Request,Response)
	{
		Joi.validate(Request.body,UserSchemas.login,function(Error,Data){
			if(!Error)
			{
				User.findOne({
					where:{
						email:Data.email,
						password:bcrypt.hashSync(Data.password, process.env.SALT)
					}
					
				})
				.then(user => {
					if(user)
					{
						var token = jwt.sign({
						name:user.name,
						id:user.id,
						email:user.email,
						role:user.role
					},process.env.JWT_KEY);

						Response.send(token);
						
					}else{
						Response.status(400);
						Response.send({success:false,error:'Invalid password or email'});
					}
					
				})
				.catch(E => {
					Response.status(400);
					Response.send({success:false,error:Error})
				});
			}else{
				Response.status(400);
				Response.send({success:false,error:Error})
			}
		})
	},

	register: function (Request,Response)
	{
		Joi.validate(Request.body,UserSchemas.register,function(Error,Data){
			if(!Error)
			{

				var hash = bcrypt.hashSync(Data.password, process.env.SALT);

				User.create({
					name: Data.name,
					email: Data.email,
					password: hash
				}).then(user => {

					var token = jwt.sign({
						name:user.name,
						id:user.id,
						email:user.email
					},process.env.JWT_KEY);


					Response.send({success:true,token: token});

				})
				.catch(E => {
					Response.status(400);
					Response.send({success:false,error:E});
				});

				

			}else{
				Response.status(400);
				Response.send(Error);
			}
		});
	},
	isAdmin: async function (Request,Response){
        if(Request.auth.role === 1)
		{
            Response.send({isAdmin:true});
		}else{
            Response.send({isAdmin:false});
		}

	},
	getUser: async function(Request, Response) {

		let user = await User.findById(Request.params.id, {
			include: [{
				model:UserSkill,
				include: [Skill]
			}]
		});

		Response.send({success:true,data:user});
	},
	getAllUsers: async function(Request, Response) {

		let users = await User.findAll();
        Response.send(users);

	},
	getUserSkills: async function(Request, Response) {

		try {
            Skill.findAll({
                include: [
                    {
                        model:UserSkill,
                        where:{
                            userId:Request.params.id
                        }
                    },
                    {
                        model: SkillCategory
                    }
                ],
            }).then(skills => {
                Response.send(skills);
            })
		} catch (Error) {

			Response.status(400);
			Response.send({success:false, error: Error});
		}

	},
	getUserSkillById: async function(Request, Response) {
        try {
            Skill.findById(Request.params.id, {
                include: [
                    {
                        model:UserSkill,
                        where:{
                            userId:Request.params.user_id,
                        }
                    },
					{
						model: SkillCategory
					}
                ],
            }).then(skills => {
                Response.send(skills);
            })
        } catch (Error) {

            Response.status(400);
            Response.send({success:false, error: Error});
        }
	},
	getUserSkillsLogs: async function(Request, Response) {

		try{
            SkillLogs.findAll({
                where:{
                    userId:Request.params.id
                },
				include: [
					{
						model:UserSkill,
						include: [
							{
								model:Skill,
								include: SkillCategory
							}
						]
					}
				]
            }).then( skills => {
            	Response.send({success:true, data:skills})
			}).catch( Error => {
                Response.status(400);
                Response.send({success:false, error: Error})
			});
		} catch (Error) {
			Response.status(400);
			Response.send({success:false, error: Error})
		}
	},
	getUserSkillLogById: async function(Request, Response) {

        try{
            SkillLogs.findAll({
                where:{
                    userId:Request.params.user_id
                },
                include: [
                    {
                        model:UserSkill,
						where:{
                        	skillId: Request.params.id
						},
                        include: [
                            {
                                model:Skill,
                                include: SkillCategory
                            }
                        ]
                    }
                ]
            }).then( skills => {
                Response.send({success:true, data:skills})
            }).catch( Error => {
                Response.status(400);
                Response.send({success:false, error: Error})
            });
        } catch (Error) {
            Response.status(400);
            Response.send({success:false, error: Error})
        }

	}
};


module.exports = UserController;
