const mongoose = require('mongoose');
const story_schema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	status: {
		type: String,
		default: 'public'
	},
	allowComments: {
		type: Boolean,
		default: true
	},
	comments: [{	// Note the syntax for an array of objects
		commentBody: {
			type: String,
			required: true
		},
		commentDate: {
			type: Date,
			default: Date.now
		},
		commentUser: {
			type: mongoose.Schema.Types.ObjectId, // This is connecting the 'field' with another one in a different db
			ref: 'users'
		}
	}],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('stories', story_schema, 'stories'); // 3rd param. specifies the name of the model (not storys)