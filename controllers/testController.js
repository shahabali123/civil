const Test = require('../models/testModel');
const wrapAsync = require('../middlewares/wrapAsync');
const ApiFeatures = require('../utils/apifeatures');
const { cloudinary } = require('../config/cloudConfig');
const sendEmail = require('../utils/sendEmail')


exports.getAllTests = async(req, res)=>{

    const resultPerPage = 40;
    const productCount = await Test.countDocuments();

Math.ceil(productCount/resultPerPage);
    const apiFeature = new ApiFeatures(Test.find().populate('user'), req.query)
    .search();
    
    const allTests = await apiFeature.query;

    if(!allTests){
        req.flash('error', 'No test found')
    }

    const currUser = res.locals.currUser;

    if(!currUser){
        req.flash('success', 'Please sign in to explore more features')
    }

    res.render("./pages/home.ejs", {allTests, currUser, });
};



exports.getSingleTest = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    const test = await Test.findById(id);
    
    if(!test){
        req.flash('error', 'Test not found')
        return res.redirect('/')
    }
    const similarTests = await Test.find({category: test.category})
    await Promise.all(similarTests.map(t => t.populate('user')));    // populating user in the test
    await test.populate('user');
    res.render('./test/singleTest.ejs', {test, similarTests});
})



exports.getCreateTest = (req, res)=>{
    res.render('./test/createTest.ejs')
}





exports.createNewTest = wrapAsync(async(req, res)=>{
    const test = new Test(req.body);
    let url = req.file.path;
    let filename = req.file.filename;
    test.image = {
        url: url,
        filename: filename
    }

    let user = req.user._id;
    test.user = user;
    test.save();
    req.flash('success', 'Test created successfully');


    const newTestUrl = `${req.protocol}://${req.get("host")}/api/v1/test/${test._id}`
    try {
        await sendEmail({
            email: process.env.ADMIN_MAIL,
            subject: `New Test Posted by ${req.user.username}`,
            message: `A new test has been posted on Civil 2 by ${req.user.username}.
          
          **Test Title:** ${test.name}
          
          **Test Category:** ${test.category}
          
          **View the test:** ${newTestUrl}
          
          Please note that this email is automatically generated and replies are not monitored. 
          `
          });
          
    } catch (error) {
        console.log(error)
    }

    res.redirect('/');
})





exports.getUpdateTestForm = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    const test = await Test.findById(id);
    res.render('./test/updateTest.ejs', {test});
})

exports.postUpdatedTest = wrapAsync(async(req, res)=>{
    const id = req.params.id;

    if(req.file){
        
    let url = req.file.path;
    let filename = req.file.filename;
        await Test.findByIdAndUpdate(id, {
            name: req.body.name,
            category: req.body.category,
            introduction: req.body.introduction,
            image: {
                url: url,
                filename: filename
            },
            sampling: req.body.sampling,
            procedure: req.body.procedure,
            formula: req.body.formula,
            result: req.body.result,
            user: req.user._id
    
        });
    }else{
        await Test.findByIdAndUpdate(id, {
            name: req.body.name,
            category: req.body.category,
            introduction: req.body.introduction,
            sampling: req.body.sampling,
            procedure: req.body.procedure,
            formula: req.body.formula,
            result: req.body.result,
            user: req.user._id
    
        });
    }

    req.flash('success', 'Test updated successfully')
    res.redirect('/');
})


exports.deleteTest = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    const test = await Test.findById(id);
    if(test){
        if(test.image.filename){
            await cloudinary.uploader.destroy(test.image.filename); // Use await here
            await Test.findByIdAndDelete(id);
            req.flash('success', 'Test deleted successfully')
            res.redirect('/');
        }else{
            req.flash('error', 'Test not found');
            res.redirect('/');
        }
    }else{
        req.flash('error', 'Test not found');
        res.redirect('/');
        }
});