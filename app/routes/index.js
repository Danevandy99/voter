'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var bodyParser = require('body-parser');
var url = require('url');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	app.use(bodyParser.urlencoded({ extended: true }));

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
		
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', 
		failureRedirect : '/login', 
		failureFlash : true 
	}));

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', 
		failureRedirect : '/login', 
		failureFlash : true 
	}));

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
		
	app.route('/view')
		.get(function (req, res) {
			res.sendFile(path + '/public/view.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.route('/api/:id/polls')
		.get(isLoggedIn, clickHandler.getPolls)
		.post(isLoggedIn, clickHandler.addPoll)
		.delete(isLoggedIn, clickHandler.deletePoll);	
		
	app.route('/api/:id/view/polls')
		.get(clickHandler.getPolls)
		.post(clickHandler.addPoll)
		.delete(isLoggedIn, clickHandler.deletePoll);

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
