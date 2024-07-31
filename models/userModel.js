const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    avatar:{
        filename: String,
        url: String
    },
    profession:{
        type:String,
        required: true
    },
    role:{
        type:String,
        default:'user',
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);