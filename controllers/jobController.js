const Job = require('../models/jobModel')
const User = require('../models/jobModel')
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
    req.flash('success', 'Job posted successfully');

    res.redirect('/api/v1/career')
});


exports.getAllJobs = wrapAsync(async(req, res, next)=>{
        const jobs = await Job.find().populate('postedBy').populate('applicant');

        if(!jobs){
            req.flash('error', 'No job found')
            res.redirect('/')
        }

    const jobsCount = await Job.countDocuments();

    if(!jobsCount){
        req.flash('error', 'No job found')
    }

    res.render('./pages/career.ejs', {jobs, jobsCount});
});


exports.getSingleJob = wrapAsync(async(req, res)=>{
    const job = await Job.findById(req.params.id).populate('postedBy').populate('applicant');
    if(!job){
        req.flash('error', 'Job not found')
        res.redirect('/api/v1/career')
    }
    
    res.render('./job/getSingleJob.ejs', {job});
})


exports.deleteJob = wrapAsync(async(req, res)=>{
    const job = await Job.findByIdAndDelete(req.params.id);
    if(!job){
        req.flash('error', 'Job not found')
        res.redirect('/api/v1/career')
    }
    req.flash('success', 'Job post deleted successfully');
    let redirectUrl = res.locals.redirectUrl || '/';
    res.redirect(redirectUrl)
})


exports.getEmailForm = wrapAsync(async(req, res)=>{
    const job = await Job.findById(req.params.id).populate('postedBy')
    res.render('./pages/inbox.ejs', {job})
})

exports.sendEmailForJob = wrapAsync(async(req, res)=>{
    const job = await Job.findById(req.params.id).populate('postedBy');
    console.log(req.body)
    const {subject, message} = req.body;
    const jobUrl = `${req.protocol}://${req.get('host')}/api/v1/job/${job._id}`
    try {
        await sendEmail({
            email: job.postedBy.email,
            subject: subject,
            message: `${message}
            <br><br>Best regards, <br> ${req.user.username}
            <br><br>
            <a href=${jobUrl}>${job.title}</a>
            <br><br>
            <p>Contact applicant: ${req.user.email}</a>`,
          });
        job.applicant = req.user._id;
        await job.save();
        req.flash('success', 'Email sent successfully');
        
    } catch (error) {
        req.flash('error', 'Error sending email')
    }
    res.redirect(`/api/v1/job/${job._id}`);
})