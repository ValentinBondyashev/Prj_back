const Joi = require('joi');
const AuthSchema = require('./AuthSchema');

const AddSchema = Joi.object({
    userId:Joi.number().min(2).required(),
    mark:Joi.number().min(1).max(10),
    disposition:Joi.number().min(1).max(10),
    skillId: Joi.number().required(),
    comment: Joi.string()
});

const CreateSchema = Joi.object({
    title: Joi.string().required(),
    category_id: Joi.number().min(1).required(),
    description: Joi.string()
});

module.exports = {
	add: AddSchema,
    create: CreateSchema
}