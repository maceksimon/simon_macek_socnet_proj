const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport config
require('./config/passport')(passport);

const app = express();

// Load Routes
const auth = require('./routes/auth');

// Use Routes
app.use('/auth', auth);


// ROUTES 

app.get('/', (req, res) => {
	res.send('works');
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on port ${port}`);
});