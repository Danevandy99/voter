'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/users');
var url = require('url');
var configAuth = require('./auth');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new GitHubStrategy({
			clientID: configAuth.githubAuth.clientID,
			clientSecret: configAuth.githubAuth.clientSecret,
			callbackURL: configAuth.githubAuth.callbackURL
		},
		function(token, refreshToken, profile, done) {
			process.nextTick(function() {
				User.findOne({
					'github.id': profile.id
				}, function(err, user) {
					if (err) {
						return done(err);
					}

					if (user) {
						return done(null, user);
					}
					else {
						var newUser = new User();

						newUser.github.id = profile.id;
						newUser.github.username = profile.username;
						newUser.github.displayName = profile.displayName;
						newUser.github.publicRepos = profile._json.public_repos;
						newUser.nbrClicks.clicks = 0;
						newUser.name = profile.displayName;

						newUser.save(function(err) {
							if (err) {
								throw err;
							}

							return done(null, newUser);
						});
					}
				});
			});
		}));


	passport.use('local-signup', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) {
			var url_parts = url.parse(req.url, true);
			var query = url_parts.query;
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({
				'email': email
			}, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err);

				// check to see if theres already a user with that email
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				}
				else {

					// if there is no user with that email
					// create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.email = email;
					newUser.password = newUser.generateHash(password); // use the generateHash function in our user model
					newUser.name = query.query;
					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}

			});

		}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true 
		},
		function(req, email, password, done) { 

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({
				'email': email
			}, function(err, user) {
				// if there are any errors, return the error before anything else
				if (err)
					return done(err);

				// if no user is found, return the message
				if (!user)
					return done(null, false, req.flash('loginMessage', 'No user found.')); 

				// if the user is found but the password is wrong
				if (!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

				// all is well, return successful user
				return done(null, user);
			});

		}));
};
