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




  exports.JoiJobSchema = Joi.object({
    title: Joi.string().required().trim(),
    link: Joi.string().trim().uri().allow('').allow(null), // Allow empty string, null for link
    companyName: Joi.string().required().trim(),
    companyDescription: Joi.string().trim().allow('').allow(null),
    location: Joi.object({
      country: Joi.string().trim().allow('').allow(null),
      city: Joi.string().trim().allow('').allow(null),
    }).allow(null), // Allow the entire location object to be null
    jobDescription: Joi.string().trim().allow('').allow(null),
    experienceRequired: Joi.string().trim().allow('').allow(null),
    salary: Joi.object({
      from: Joi.number().min(0).allow('').allow(null), // Allow empty, null for salary range
      to: Joi.number().min(0).allow('').allow(null),
    }).allow(null), // Allow the entire salary object to be null
    howToApply: Joi.string().trim().allow('').allow(null),
    postedAt: Joi.date().allow('').allow(null), // Allow empty string, null for date
  });
  




