const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');



module.exports = function(passport) { // Why function instead of object?
	passport.use(
		new GoogleStrategy({ /* instantiating the GS with an object (keys from google console) */
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true /* Stops erros when Heroku tries to load on HTTPS */
		}, /* This is a callback! */
		(accessToken, refreshToken, profile, done) => {
			console.log(accessToken);
			console.log(profile);
		}
	)); /* note the parenteses: GS takes 2 arguments {object}, function(){} */
}