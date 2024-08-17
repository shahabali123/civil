const Test = require('../models/testModel')
const User = require('../models/userModel')
const Job = require('../models/jobModel')


module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to perform this action.");
        return res.redirect("/api/v1/login");
    }
    next();
};


// middleware for checking if the user was editing or deleting the test he is the owner of the listing or not
module.exports.isOwner = async (req, res, next)=>{
    let id = req.params.id;
let test = await Test.findById(id);

if (!test) {
    req.flash('error', 'Test not found!');
    return res.redirect('/'); // Or handle the error differently
}
if (!test.user._id.equals(res.locals.currUser._id)) {
    req.flash('error', 'You do not have permission to edit or delete this listing!');
    return res.redirect(`/`)
}
next();
};


module.exports.isJobOwner = async(req, res, next)=>{
    let id = req.params.id;
    let job = await Job.findById(id);
    if (!job) {
        req.flash('error', 'Job not found!');
        return res.redirect('/api/v1/career'); 
        }
        if (!job.postedBy._id.equals(res.locals.currUser._id)) {
            req.flash('error', 'You do not have permission to edit or delete this listing!');
            return res.redirect(`/api/v1/career`)
            }
            next();
}


module.exports.isAdmin = async(req, res, next)=>{
    if (res.locals.currUser.role !== 'admin') {
        req.flash('error', 'You do not have permission to access dashboard!');
        return res.redirect(`/`)
    }
    next();
};