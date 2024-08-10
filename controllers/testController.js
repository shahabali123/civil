const Test = require('../models/testModel');
const wrapAsync = require('../middlewares/wrapAsync');
const ApiFeatures = require('../utils/apifeatures');
const { cloudinary } = require('../config/cloudConfig');


exports.getAllTests = async(req, res)=>{

    const resultPerPage = 40;
    const productCount = await Test.countDocuments();

Math.ceil(productCount/resultPerPage);
    const apiFeature = new ApiFeatures(Test.find(), req.query)
    .search();
    
    const allTests = await apiFeature.query;

    if(!allTests){
        req.flash('error', 'No test found')
    }

    const currUser = res.locals.currUser;

    if(!currUser){
        req.flash('success', 'Please sign in to explore more features')
    }

    res.render("./pages/home.ejs", {showHero: true, allTests, currUser, });
};

exports.getSingleTest = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    const test = await Test.findById(id);
    if(!test){
        req.flash('error', 'Test not found')
        return res.redirect('/api/v1/tests')
    }
    // populating user in the test
    await test.populate('user');
    res.render('./test/singleTest.ejs', {test, showHero: false});
})


exports.getCreateTest = (req, res)=>{
    res.render('./test/createTest.ejs', {showHero: false})
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
    req.flash('success', 'Test created successfully')
    res.redirect('/api/v1/tests');
})

exports.getUpdateTestForm = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    const test = await Test.findById(id);
    res.render('./test/updateTest.ejs', {test, showHero: false});
})

exports.postUpdatedTest = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    let url = req.file.path;
    let filename = req.file.filename;

    if(req.file){
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
    res.redirect('/api/v1/tests');
})


exports.deleteTest = wrapAsync(async(req, res)=>{
    const id = req.params.id;
    const test = await Test.findById(id);
    if(test){
        if(test.image.filename){
            await cloudinary.uploader.destroy(test.image.filename); // Use await here
            await Test.findByIdAndDelete(id);
            req.flash('success', 'Test deleted successfully')
            res.redirect('/api/v1/tests');
        }else{
            req.flash('error', 'Test not found');
            res.redirect('/api/v1/tests');
        }
    }else{
        req.flash('error', 'Test not found');
        res.redirect('/api/v1/tests');
        }
});