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
    req.flash('success', 'Job posted successfully');

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
    res.redirect(`/api/v1/user/${job.postedBy._id}#user-jobs`)
})


// exports.getEmailForm = wrapAsync(async(req, res)=>{
//     const job = Job.findById(req.params.id).populate('postedBy')
//     res.render('./components/messagebox.ejs', {job})
// })

// exports.sendEmailForJob = wrapAsync(async(req, res)=>{

//     const job = await Job.findById(req.params.id);
//     const postedBy = await UserActivation.findById(job.postedBy._id);
//     const {subject, message} = req.body;
//     const jobUrl = `${req.protocol}://${req.get('host')}/api/v1/job/${job._id}`
//     try {
//         await sendEmail({
//             email: postedBy.email,
//             subject: subject,
//             message: `${message}
//             <br><br>Best regards, <br> ${req.user.name}
//             <br><br>
//             <a href=${jobUrl}>See Job</a>`,
//           });
//         job.applicant = req.user._id;
//         await job.save();
//         req.flash('success', 'Email sent successfully');
        
//     } catch (error) {
//         req.flash('error', 'Error sending email')
//         console.log(error)
//     }
//     res.redirect(`/api/v1/job/${job._id}`);
// })