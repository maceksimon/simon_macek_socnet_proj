const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load user model
const User = mongoose.model('users');

module.exports = function(passport) { // Why function instead of object?
	passport.use(
		new GoogleStrategy({ /* instantiating the GS with an object (keys from google console) */
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true /* Stops erros when Heroku tries to load on HTTPS */
		}, /* This is a callback! */
		(accessToken, refreshToken, profile, done) => {
			const image = profile.photos[0].value.substring(0,
				profile.photos[0].value.indexOf('?'));

			const newUser = {
				googleID: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				email: profile.emails[0].value,
				image: image
			}

			// Check for existing user
			User.findOne({
				googleID: profile.id
			}).then((user) => {
				if(user) {
					/* if there is a user in db, just return that one */
					done(null, user);
				} else {
					/* if there is none yet, create new one and return it */
					new User(newUser)
						.save()
						.then(user => done(null, user));
				}
			});

		}
	)); /* note the parenteses: GS takes 2 arguments {object}, function(){} */


	passport.serializeUser((user, done) => {
		done(null, user.id); 
	});

	passport.deserializeUser((id, done) => {
		User.findById(id).then(user => done(null, user));
	});
}