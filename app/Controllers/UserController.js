const GlobalModel = require('./../Models/index');
/*
 	MODELS
*/
const User = GlobalModel.users;
const Skill = GlobalModel.skills;
const UserSkill = GlobalModel.userSkills;
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
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTUzMDQ1MDc2M30.TX3eLlCPZ9JpsOejmugDT0jLsUyATUpGBJPznAorKS4

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
        if(Request.body.auth.role === 1)
		{
            Response.send({isAdmin:true});
		}else{
            Response.send({isAdmin:false});
		}

	}

};


module.exports = UserController;