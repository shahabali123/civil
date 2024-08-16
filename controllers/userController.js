const User = require('../models/userModel')
const wrapAsync = require('../middlewares/wrapAsync')
const passport = require('passport')
const Test = require('../models/testModel')
const sendEmail = require('../utils/sendEmail');
const Job = require('../models/jobModel')



exports.getRegistrationForm = (req, res)=>{
    res.render('./user/register.ejs')
}


exports.registerUser = wrapAsync(async(req, res)=>{
    const {username, email, profession, password} = req.body;
    const newUser = new User({username, email, profession});
    let url = req.file.path;
    let filename = req.file.filename;
    newUser.avatar = {
        url: url,
        filename: filename
    };
    const registerUser = await User.register(newUser, password);
    req.login(registerUser,(err)=>{
        if(err) return next(err);
    })
    req.flash('success', 'Account created successfully');

    // send mail to admin about new user registration
    
    try {
        const newUserUrl = `${req.protocol}://${req.get('host')}/api/v1/user/${registerUser._id}`
    const message = `New user ${registerUser.username} (${registerUser.email}) has been registered.
<img href="registerUser.avatar.url"/>
            Their profession is: ${registerUser.profession}
            You can view the user details here: <a href="${newUserUrl}">${registerUser.username}</a>`;

        await sendEmail({
            email: process.env.ADMIN_MAIL,
            subject: 'New User Registered',
            message: message,
        })
    } catch (error) {
        console.log(error);
    }
    

    res.redirect('/api/v1/tests');
})


exports.getLoginForm = (req, res)=>{
    res.render('./user/login.ejs')
}


// logout route
module.exports.logOut = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "Logged out successfully!")
        res.redirect('/api/v1/tests');
    }); 
};

// get single user route
module.exports.getSingleUser = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    const user = await User.findById(id);
    const userTests = await Test.find({ user: id });
    const userJobs = await Job.find({postedBy: id});

    if(!user){
        req.flash('error', 'User not found')
    }
    res.render('./user/showUser.ejs', {user, userTests, userJobs})
})