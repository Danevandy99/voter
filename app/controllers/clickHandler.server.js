'use strict';

var Users = require('../models/users.js');
var Poll = require('../models/polls.js');
var url = require('url');

function ClickHandler() {

	function cleanArray(actual) {
		var newArray = new Array();
		for (var i = 0; i < actual.length; i++) {
			if (actual[i]) {
				newArray.push(actual[i]);
			}
		}
		return newArray;
	}

	this.addPoll = function(req, res) {
		var newPoll = new Poll();
		newPoll.name = req.body.name;
		var options = req.body.options;
		var optionsArray = [];
		for (var i = 0; i < options.length; i++) {
			var jo = {};
			jo.name = options[i];
			jo.votes = 0;
			optionsArray.push(jo);
		}
		newPoll.options = optionsArray;
		newPoll.author_id = req.user.github.id;
		newPoll.save(function(err) {
			if (err) {
				throw err;
			}
		});
		res.json(newPoll);
	};

	this.getPolls = function(req, res) {
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		if (query.query === undefined) {
			Poll
			.find({
				'author_id': req.user.github.id
			}, {
				'__v': false
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}
				res.json(result);
			})
		} else {
			Poll
			.findOne({
				'author_id': req.user.github.id,
				'_id': query.query
			}, {
				'__v': false
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}
				res.json(result);
			})
		}
		
	};

	this.deletePoll = function(req, res) {
		Poll
			.findOneAndRemove({
				'_id': req.body.id
			})
			.exec(function(err) {
				if (err) {
					throw err;
				}
				console.log('Delete Successful');
				res.json('DELETED');
			})
	};

	this.getClicks = function(req, res) {
		Users
			.findOne({
				'github.id': req.user.github.id
			}, {
				'_id': false
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function(req, res) {
		Users
			.findOneAndUpdate({
				'github.id': req.user.github.id
			}, {
				$inc: {
					'nbrClicks.clicks': 1
				}
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result.nbrClicks);
			});
	};

	this.resetClicks = function(req, res) {
		Users
			.findOneAndUpdate({
				'github.id': req.user.github.id
			}, {
				'nbrClicks.clicks': 0
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result.nbrClicks);
			});
	};

}

module.exports = ClickHandler;
