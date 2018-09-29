const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyparser = require('body-parser');
const methodoverride = require('method-override');

// Load user model
require('./models/User'); /* note that this needs to be here for auth script to run */
require('./models/Story');

// Passport config
require('./config/passport')(passport);


const app = express();

// Load Keys
const keys = require('./config/keys')

// Handlebars helpers
const {
	truncate,
	stripTags,
	formatDate,
	select,
	editIcon
} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
	.then(() => console.log('mongo connected'))
	.catch((err) => console.log(err));

// Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
//	To be able to select req.body.data_title

// Method override middleware
app.use(methodoverride('_method'));


// Handlebars middleware
app.engine('handlebars', handlebars({
	helpers: {		// This seems to be a part of the handlebars call - helpers option
		truncate: truncate,
		stripTags: stripTags,
		formatDate: formatDate,
		select: select,
		editIcon: editIcon
	},				// After inserting here, you can use the function in the hndlbrs files
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
/*
	What is static folder? Why do you want the stylesheet there?
	why do you need to create a path to it through express??
*/


// Use Routes --- ROUTES AT THE BOTTOM
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);




const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on port ${port}`);
});