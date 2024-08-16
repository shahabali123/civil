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
  link: Joi.string().trim().uri().allow(''), // Allow empty string for link
  companyName: Joi.string().required().trim(),
  companyDescription: Joi.string().trim().allow(''),
  location: Joi.object({
    country: Joi.string().trim().allow(''),
    city: Joi.string().trim().allow(''),
  }),
  jobDescription: Joi.string().trim().allow(''),
  experienceRequired: Joi.string().trim().allow(''),
  salary: Joi.object({
    from: Joi.number().min(0).allow(''), // Allow empty for salary range
    to: Joi.number().min(0).allow(''),
  }),
  howToApply: Joi.string().trim().allow(''),
  // You might not need to validate postedBy and applicant here 
  // as they are handled by Mongoose relationships
  // postedBy: Joi.objectId(), 
  // applicant: Joi.objectId(),
  postedAt: Joi.date().allow(''), // Allow empty string for date
});





