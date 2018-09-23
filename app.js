const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieparser = require('cookie-parser');
const session = require('express-session');


// Load user model
require('./models/User'); /* note that this needs to be here for auth script to run */

// Passport config
require('./config/passport')(passport);


const app = express();

// Load Keys
const keys = require('./config/keys')

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
	.then(() => console.log('mongo connected'))
	.catch((err) => console.log(err));

// Handlebars middleware
app.engine('handlebars', handlebars({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// Cookie parser
app.use(cookieparser());
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
/*
	This is your own middleware function - remember express runs this one by one
	(you might actually look for some sense in ordering there!)
	this will set the locals field --- my guess: next time you're gonna be using req.locals.user
*/
	res.locals.user = req.user || null;
	next();
});


// Use Routes --- ROUTES AT THE BOTTOM
app.use('/auth', auth);
app.use('/', index);




const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on port ${port}`);
});