const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', /* the 'google' parameter is read automatically */
	/* Scope - what you want to get from the user: */ {scope: ['profile', 'email']}));

router.get('/google/callback', 
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/dashboard');
	});



module.exports = router;