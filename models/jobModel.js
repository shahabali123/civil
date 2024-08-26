const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    link:{
        type: String,
        trim: true
    },
    companyName:{
        type: String,
        required: [true, "Please provide a company name"]
    },
    companyDescription:{
        type: String,
        trim: true
    },
    location:{
        country:{
            type: String,
            trim: true
        },
        city:{
            type: String,
            trim: true
        }
    },
    jobDescription:{
        type: String,
        trim: true
    },
    experienceRequired:{
        type: String,
        trim: true
    },
    salary:{
        from: {
            type: Number,
            trim: true
        },
        to:{
            type: Number,
            trim: true
        }
    },
    howToApply:{
        type: String,
        trim: true
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    applicant:[{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    postedAt:{
        type: Date,
        default: Date.now
    },
})


const Job = mongoose.model('Job', jobSchema);
module.exports = Job;