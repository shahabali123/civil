const express = require('express')
const router = express.Router();

const {isLoggedIn, isOwner}= require('../middlewares/authentication')

const { getPostJobForm, postJob, getAllJobs }= require('../controllers/jobController')


router.get('/job/create', isLoggedIn, getPostJobForm);

router.post('/job/create', isLoggedIn, postJob);

router.get('/career', getAllJobs)


module.exports = router;