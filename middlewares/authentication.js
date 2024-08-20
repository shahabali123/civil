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

module.exports.isCurrUser = (req, res, next) => {
    // Allow admin to delete any account
    if (req.user.role === 'admin') {
        req.session.redirectUrl = req.originalUrl;
      return next();
    }
  
    // For non-admin users, check if they are trying to delete their own account
    if (req.user.id !== req.params.id) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You do not have permission to perform this action.");
      return res.redirect("/api/v1/login");
    }
  
    next();
  };


// middleware for checking if the user was editing or deleting the test he is the owner of the listing or not
// middleware for checking if the user was editing or deleting the test he is the owner of the listing or not
module.exports.isOwner = async (req, res, next) => {
    let id = req.params.id;
    let test = await Test.findById(id);
  
    // Allow admin to edit/delete any test
    if (req.user.role === 'admin') {
        req.session.redirectUrl = req.originalUrl;
      return next();
    }
  
    if (!test) {
      req.flash('error', 'Test not found!');
      return res.redirect('/');
    }
  
    if (!test.user._id.equals(res.locals.currUser._id)) {
        req.session.redirectUrl = req.originalUrl;
      req.flash('error', 'You do not have permission to edit or delete this listing!');
      return res.redirect(`/`);
    }
  
    next();
  };
  
  
  module.exports.isJobOwner = async (req, res, next) => {
    let id = req.params.id;
    let job = await Job.findById(id);
  
    // Allow admin to edit/delete any job
    if (req.user.role === 'admin') {
        req.session.redirectUrl = req.originalUrl;
      return next();
    }
  
    if (!job) {
      req.flash('error', 'Job not found!');
      return res.redirect('/api/v1/career');
    }
  
    if (!job.postedBy._id.equals(res.locals.currUser._id)) {
        req.session.redirectUrl = req.originalUrl;
      req.flash('error', 'You do not have permission to edit or delete this listing!');
      return res.redirect(`/api/v1/career`);
    }
  
    next();
  };
  


module.exports.isAdmin = async(req, res, next)=>{
    if (res.locals.currUser.role !== 'admin') {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You do not have permission to access dashboard!');
        return res.redirect(`/`)
    }
    next();
};