const Joi = require('joi')


module.exports.joiTestSchema = Joi.object({
    name: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    introduction: Joi.string().trim(),
    equipments: Joi.array().items(Joi.string().trim()),
    image: Joi.string(),
    sampling: Joi.array().items(Joi.string().trim()),
    procedure: Joi.array().items(Joi.string().trim().required()),
    formula: Joi.string().trim(),
    result: Joi.string().trim(),
    date: Joi.date(),
    user: Joi.string()
  });
