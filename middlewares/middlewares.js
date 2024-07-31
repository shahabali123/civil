const {joiTestSchema} = require('../utils/joiSchemaValidation')
const Test = require('../models/testModel')
const ExpressError = require('./ExpressError')

// Test schema validation using joi
module.exports.validateTest = (req, res, next)=>{
    const {error} = joiTestSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
        } else {
            next();
    }
};

// redirect URL  when not logged in on the same page from where the user comes from
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
