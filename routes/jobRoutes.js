const express = require('express')
const router = express.Router();

const {isLoggedIn, isOwner, isJobOwner}= require('../middlewares/authentication')

const { getPostJobForm, postJob, getAllJobs, getSingleJob, deleteJob }= require('../controllers/jobController')


router.get('/job/create', isLoggedIn, getPostJobForm);

router.post('/job/create', isLoggedIn, postJob);

router.get('/career', getAllJobs)

router.get('/job/:id', getSingleJob);

router.delete('/job/:id/delete', isLoggedIn, isJobOwner, deleteJob);


module.exports = router;