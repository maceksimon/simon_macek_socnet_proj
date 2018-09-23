const mongoose = require('mongoose');
const user_schema = new mongoose.Schema({
	googleID: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	email: {
		type: String
	},
	image: {
		type: String
	}
});

mongoose.model('users', user_schema);