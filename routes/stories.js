const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');

const Story = mongoose.model('stories');
const User = mongoose.model('users');

router.get('/', (req, res) => {
	Story.find({status: 'public'})
		.populate('user')	// This draws data from the user model into the user field of the story we found
		.sort({date: 'desc'})
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		});
});

// Add story form
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});


// Edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
	.then(story => {
		if (story.user != req.user.id) {
			res.redirect('/stories');
		} else {
			res.render('stories/edit', {story: story});			
		}
	});
});

// Process Add Story
router.post('/', (req, res) => {
	let allowComments;

	if(req.body.allowComments) { // This is to process the checkbox field which returns a string!
		allowComments = true;
	} else {
		allowComments = false;
	}

	const newStory = {
		title: req.body.title,
		body: req.body.body,
		status: req.body.status,
		allowComments: allowComments,
		user: req.user.id
	}

	new Story(newStory).save()
		.then((story) => {
			res.redirect(`/stories/show/${story.id}`);
		});
});

// Show single story
router.get('/show/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
	.populate('user')
/*
	This 'populate' allows you to access user information through the commentUser field in your handlebars files:
*/
	.populate('comments.commentUser')
	.then(story => {
		// Always consider if you want to simply render a view (this means copy pasting URL avoids authentication!)
		// This checks whether we are logged in and whether the private story belongs to us before it shows it
		if (story.status == 'public') {
			res.render('stories/show', {story: story});
		} else {
			if (req.user) {
				if (req.user.id == story.user._id) {
					res.render('stories/show', {story: story});
				} else {
					res.redirect('/stories');
				}
			} else {
				res.redirect('/stories');
			}
		}
	});
});

// List stories from a single user
router.get('/user/:userId', (req, res) => {
	Story.find({user: req.params.userId, status: 'public'})
		.populate('user')
		.then(stories => {
			res.render('stories/index', {stories: stories});
		});
});

// My stories route
router.get('/my', ensureAuthenticated, (req, res) => {
	Story.find({user: req.user.id})
		.populate('user')
		.then(stories => {
			res.render('stories/index', {stories: stories});
		});
});

// Edit form route
router.put('/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	}).then(story => {
		let allowComments; // Processing the checkbox
		if(req.body.allowComments) {
			allowComments = true;
		} else {
			allowComments = false;
		}
		// New values
		story.title = req.body.title;
		story.body = req.body.body;
		story.status = req.body.status;
		story.allowComments = allowComments;
		// Save to db
		story.save()
			.then(story => {
				res.redirect('/dashboard');
			}); // end save-then block
	}); // end findOne-then block
}); // end put method

// Delete story
router.delete('/:id', (req, res) => {
	Story.deleteOne({_id: req.params.id})
		.then(() => {
			res.redirect('/dashboard');
		});
});

// Add comment
 router.post('/comment/:id', (req, res) => {
 	Story.findOne({
 		_id: req.params.id
 	}).then(story => {
 		const newComment = {
 			commentBody: req.body.commentBody,
 			commentUser: req.user.id
 		};
 		// Add to the comments array
 		story.comments.unshift(newComment);
 		story.save()
 			.then(story => {
 				res.redirect(`/stories/show/${story.id}`);
 			})
 			.catch((err) => {
 				console.log(err);
 			}); // end save-then-catch block
 	}); // end post-then block
 }); // end post method

module.exports = router;