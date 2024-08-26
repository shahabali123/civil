const User = require('../models/userModel')
const wrapAsync = require('../middlewares/wrapAsync')
const passport = require('passport')
const Test = require('../models/testModel')
const sendEmail = require('../utils/sendEmail');
const Job = require('../models/jobModel')
const { cloudinary } = require('../config/cloudConfig');



exports.getRegistrationForm = (req, res)=>{
    res.render('./user/register.ejs')
}


exports.registerUser = wrapAsync(async (req, res, next) => {
  try {
    const { username, email, profession, password } = req.body;
    const newUser = new User({ username, email, profession });

    // Handle avatar upload (if provided)
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      newUser.avatar = {
        url: url,
        filename: filename,
      };
    }

    const registeredUser = await User.register(newUser, password);

    // Log in the newly registered user
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); 
      }

      req.flash('success', 'Account created successfully');

      // Send email to admin about new user registration
      try {
        const newUserUrl = `${req.protocol}://${req.get('host')}/api/v1/user/${registeredUser._id}`;
        const message = `
          <p>New user ${registeredUser.username} (${registeredUser.email}) has been registered.</p>
          ${registeredUser.avatar.url ? `<img src="${registeredUser.avatar.url}" alt="User Avatar" style="max-width: 200px;">` : ''}
          <p>Their profession is: ${registeredUser.profession}</p>
          <p>You can view the user details here: <a href="${newUserUrl}">${registeredUser.username}</a></p>
        `;

        sendEmail({
          email: process.env.ADMIN_MAIL,
          subject: 'New User Registered on Civil 2', // More descriptive subject
          message: message,
        });
      } catch (error) {
        console.error('Error sending registration email to admin:', error);
        // Consider adding a flash message to inform the user about the email issue
      }

      res.redirect('/'); 
    });
  } catch (err) {
    return next(err);
    res.redirect('/api/v1/register');
  }
});


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
        res.redirect('/');
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



// delete user
module.exports.deleteUser = wrapAsync(async (req, res) => {
    const id = req.params.id;
    const user = req.user;
  
    if (user) {
      try {
        // Delete user's avatar from Cloudinary (if exists)
        if (user.avatar.filename) {
          await cloudinary.uploader.destroy(user.avatar.filename);
        }
  
        // Find tests created by the user
        const userTests = await Test.find({ user: id });
  
        // Delete test images from Cloudinary and then delete the tests
        for (const test of userTests) {
          if (test.image.filename) {
            await cloudinary.uploader.destroy(test.image.filename);
          }
        }
        await Test.deleteMany({ user: id });
  
        // Find and delete jobs posted by the user
        await Job.deleteMany({ postedBy: id });
  
        // Finally, delete the user
        await User.findByIdAndDelete(id);
  
        req.flash('success', 'User and associated data deleted successfully');
        let redirectUrl = res.locals.redirectUrl || '/';
        res.redirect(redirectUrl);
      } catch (error) {
        console.error('Error deleting user and associated data:', error);
        req.flash('error', 'Error deleting user and associated data');
        res.redirect('/');
      }
    } else {
      req.flash('error', 'User not found');
      res.redirect('/');
    }
  });
  