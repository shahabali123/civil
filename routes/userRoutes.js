const express = require('express')
const router = express.Router()
const passport = require('passport')
const sendEmail = require('../utils/sendEmail')

const {storage, cloudinary} = require('../config/cloudConfig')
const multer = require('multer');
const upload = multer({storage});
const {saveRedirectUrl}= require('../middlewares/middlewares');

const {isLoggedIn}= require('../middlewares/authentication')




const {getRegistrationForm, registerUser, getLoginForm, logOut, getSingleUser} = require('../controllers/userController');


router.get('/register', getRegistrationForm);

router.post('/register', 
    upload.single('avatar'),
    registerUser);

router.get('/login', getLoginForm);

router.get('/user/:id', isLoggedIn, getSingleUser);


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
        subject: 'Welcome Back to Civil 2!',
        message: `Hi ${req.user.username},

Welcome back to Civil 2! We're glad you're here.

Thanks,
The Civil 2 Team`
      });
    } catch (error) {
      console.error('Error sending login email:', error);
    }
      res.redirect('/api/v1/tests'); 
    }
);


router.get("/logout", logOut); // GET request for logout





module.exports = router;