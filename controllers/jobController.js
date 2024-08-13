const Job = require('../models/jobModel')
const wrapAsync = require('../middlewares/wrapAsync');
const sendEmail = require('../utils/sendEmail');
const ExpressError = require('../middlewares/ExpressError');



exports.getPostJobForm = (req, res)=>{
    res.render('./job/jobPostForm.ejs');
}


exports.postJob = wrapAsync(async(req, res)=>{
    
    const job = new Job(req.body);
    job.postedBy = req.user._id;

    job.save();

    res.redirect('/api/v1/career')
});


exports.getAllJobs = wrapAsync(async(req, res, next)=>{
        const jobs = await Job.find().populate('postedBy').populate('applicant');

        if(!jobs){
            req.flash('error', 'No job found')
            res.redirect('/api/v1/tests')
        }

    const jobsCount = await Job.countDocuments();

    if(!jobsCount){
        req.flash('error', 'No job found')
    }

    res.render('./pages/career.ejs', {jobs, jobsCount});
});
