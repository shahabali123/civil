const { url } = require('inspector');
const { required, date } = require('joi');
const mongoose = require('mongoose');
const { type } = require('os');


const testSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please input Test name'],
        trim: true,
    },
    category:{
        type: String,
        required: [true, 'Please select Test category'],
    },
    introduction:{
        type: String,
    },
    equipments:[{
        type: String,
        trim: true
    }],
    image:{
        url: String,
        filename: String,
    },
    sampling:[{
        type: String,
        trim: true
    }],
    procedure:[{
        type: String,
        required: [true, 'Please input the procedure for this test'],
        trim: true
    }],
    formula:{
        type: String,
    },
    result:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now()
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});


const Test = mongoose.model('Test', testSchema);

module.exports = Test;