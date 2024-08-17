const express = require('express');
const router = express.Router();
const {validateTest} = require('../middlewares/middlewares')
const {isLoggedIn, isOwner}= require('../middlewares/authentication')
const {storage, cloudinary} = require('../config/cloudConfig')
const multer = require('multer');
const upload = multer({storage});



const {getAllTests, getSingleTest, getCreateTest, createNewTest, getUpdateTestForm, postUpdatedTest, deleteTest } = require('../controllers/testController');


router.get('/', getAllTests);



router.get('/api/v1/test/create', 
    isLoggedIn,
    getCreateTest)

router.post('/api/v1/test/create', 
    isLoggedIn, 
    upload.single('image'),
    validateTest, 
    createNewTest)

router.get('/api/v1/test/update/:id', isLoggedIn, isOwner, getUpdateTestForm)

router.patch('/api/v1/test/update/:id', 
    isLoggedIn, 
    isOwner, 
    upload.single('image'),
    validateTest, 
    postUpdatedTest)

router.delete('/api/v1/test/delete/:id', 
    isLoggedIn, 
    isOwner, 
    deleteTest)


    router.get('/api/v1/test/:id', getSingleTest);

module.exports = router;