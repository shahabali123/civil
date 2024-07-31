const express = require('express')
const router = express.Router()
const passport = require('passport')

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
    (req, res) => {
      req.flash('success', `Welcome back!`);
      res.redirect('/api/v1/tests'); 
    }
);


router.get("/logout", logOut); // GET request for logout





module.exports = router;