const Test = require('../models/testModel');
const wrapAsync = require('../middlewares/wrapAsync');
const User = require('../models/userModel')
const Job = require('../models/jobModel')




exports.getDashboard = wrapAsync(async(req, res)=>{
    const users = await User.find();
    const tests = await Test.find().populate('user');
    const jobs = await Job.find().populate('postedBy');

    res.render('./pages/dashboard.ejs', {users, tests, jobs})
})
