const Joi = require('joi');

const LoginSchema = Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required()
});

const RegisterSchema = Joi.object().keys({
	name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required()
});

module.exports = {
	login: LoginSchema,
	register: RegisterSchema
}