const express = require('express')
const router = express.Router();
const {isAdmin, isLoggedIn} = require('../middlewares/authentication')

const {getDashboard}= require('../controllers/dashboardController');


router.get('/dashboard', isLoggedIn, isAdmin, getDashboard);


module.exports = router;