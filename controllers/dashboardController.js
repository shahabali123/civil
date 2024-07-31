const Test = require('../models/testModel');
const wrapAsync = require('../middlewares/wrapAsync');
const User = require('../models/userModel')




exports.getDashboard = wrapAsync(async(req, res)=>{
    const users = await User.find();
    const tests = await Test.find().populate('user');
    res.render('./pages/dashboard.ejs', {users, tests})
})
