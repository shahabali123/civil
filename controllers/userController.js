const User = require('../models/userModel')
const wrapAsync = require('../middlewares/wrapAsync')
const passport = require('passport')
const Test = require('../models/testModel')



exports.getRegistrationForm = (req, res)=>{
    res.render('./user/register.ejs', {showHero: false})
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
    res.redirect('/api/v1/tests');
})


exports.getLoginForm = (req, res)=>{
    res.render('./user/login.ejs', {showHero: false})
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

    if(!user){
        req.flash('error', 'User not found')
    }
    res.render('./user/showUser.ejs', {user, userTests, showHero: false})
})