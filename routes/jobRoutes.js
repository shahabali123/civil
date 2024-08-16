const express = require('express')
const router = express.Router();

const {isLoggedIn, isJobOwner}= require('../middlewares/authentication')

const { getPostJobForm, postJob, getAllJobs, getSingleJob, deleteJob, sendEmailForJob, getEmailForm }= require('../controllers/jobController')


router.get('/job/create', isLoggedIn, getPostJobForm);

router.post('/job/create', isLoggedIn, postJob);

router.get('/career', getAllJobs)

router.get('/job/sendmail/:id', isLoggedIn, getEmailForm);

router.post('/job/:id/sendemail', isLoggedIn, sendEmailForJob);

router.get('/job/:id', getSingleJob);

router.delete('/job/:id/delete', isLoggedIn, isJobOwner, deleteJob);




module.exports = router;