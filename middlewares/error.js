const ErrorHandler = require('../utils/errorHandler.js');


module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error";

    // handling cast errors
    if(err.name === 'CastError'){
        const message = `Resource not found with ${err.path}:${err.value}`;
        err = new ErrorHandler(message ,400);
    }

    // mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message ,400);
    }

    // Wrong JWT error
    if(err.name === 'TokenExpiredError'){
        const message = "Json Web Token is Expired, try again";
        err = new ErrorHandler(message ,400);
    }

    // validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        err = new ErrorHandler(message ,400);
        }

    // JWT expire error
    if(err.name === 'JsonWebTokenError'){
        const message = "Json Web Token is invalid, try again";
        err = new ErrorHandler(message ,400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        satck: err.stack
    });
}