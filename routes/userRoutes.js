const express = require('express')
const router = express.Router()
const passport = require('passport')
const sendEmail = require('../utils/sendEmail')

const {storage, cloudinary} = require('../config/cloudConfig')
const multer = require('multer');
const upload = multer({storage});
const {saveRedirectUrl}= require('../middlewares/middlewares');

const {isLoggedIn, isCurrUser}= require('../middlewares/authentication')




const {getRegistrationForm, registerUser, getLoginForm, logOut, getSingleUser, deleteUser} = require('../controllers/userController');


router.get('/register', getRegistrationForm);

router.post('/register', 
    upload.single('avatar'),
    registerUser);

router.get('/login', getLoginForm);

router.get('/user/:id', getSingleUser);


router.post('/login', 
  saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/api/v1/login',
      failureFlash: true,
    }),
    async(req, res) => {
      req.flash('success', `Welcome back!`);
      // Send email to user on successful login
    try {
      await sendEmail({
        email: req.user.email, // Send to the logged-in user's email
        subject: 'Welcome Back to Naxgat!',
        message: `<pre>Hi ${req.user.username}
        Welcome back to Civil 2! We're glad you're here.
        If you are professional and want to contribute on our platform you can post Laboratory tests and offer new jobs openings to professionals in career section.</pre>,



Thanks,
The Naxgat Team`
      });
    } catch (error) {
      console.error('Error sending login email:', error);
    }
    let redirectUrl = res.locals.redirectUrl || '/';
      res.redirect(redirectUrl); 
    }
);


router.get("/logout", logOut); // GET request for logout


router.delete('/user/:id/delete', isLoggedIn, isCurrUser, deleteUser)


module.exports = router;