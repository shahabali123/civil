if(process.env.NODE_ENV != 'production'){
    require('dotenv').config({path: './config/config.env'})
}

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodoverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')


const connectDatabase = require('./config/database');
const User = require('./models/userModel')
const test = require('./routes/testRoutes');
const user = require('./routes/userRoutes')
const dashboard = require('./routes/dashboardRoutes');
const job = require('./routes/jobRoutes');








const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodoverride("_method"))
app.set('views', path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(flash());
connectDatabase();


// _______________________________________

// mongo session store
const store = MongoStore.create({
    mongoUrl: process.env.DB_URI,
    crypto:{
        secret: process.env.SECRET_KEY
    },
    touchAfter: 24 * 3600,
});
// mongo session store error handler
store.on('error', (err)=>{
    console.log('Mongo Serssion store Error!', err);
})
// express session section
const sessionOptions = {
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
    store: store,
}
app.use(session(sessionOptions));
app.use(flash());
// _______________________________________

// passport section
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// _______________________________________

app.use((req, res, next)=>{
    res.locals.success  = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
});

// __________________________________






app.use('/api/v1', test);
app.use('/api/v1', user);
app.use('/api/v1', dashboard);
app.use('/api/v1', job);


app.listen(process.env.PORT, ()=>{
    console.log(`App is listening on Port ${process.env.PORT}`)
})

app.all('*', (req, res)=>{
    res.render('./error/404.ejs')
})


app.use((err, req, res, next) => {
    if (err.name === 'CastError') {
        err.status = 404;
        err.message = 'Resource not found';
    } else if (err.name === 'ValidationError') {
        err.status = 400;
        err.message = 'Validation failed';
    } else if (err.name === 'MongoError' && err.code === 11000){
        err.status = 400;
        err.message = 'Duplicate entry';
    } else {
        err.status = 500;
        err.message = 'Internal server error!';
    }
    let {status, message} = err;
    res.render("./error/error.ejs", {err});
});

// _____________________________________________