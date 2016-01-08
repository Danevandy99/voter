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
	
	this.addOption = function(req, res) {
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		var new_option = req.body.new_option;
		var jo = {};
		jo.name = new_option;
		jo.votes = 0;
			Poll
			.findOneAndUpdate({
				'_id': query.query
			}, {
				$push: {
					'options': jo
				}
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result);
			});
	}

	this.addPoll = function(req, res) {
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		if (query.query === undefined) {
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
			newPoll.author_id = req.user._id;
			newPoll.save(function(err) {
				if (err) {
					throw err;
				}
			});
			res.json(newPoll);
		} else {
			var option = req.body.option;
			Poll
			.findOneAndUpdate({
				'_id': query.query,
				'options.name': option
			}, {
				$inc: {
					'options.$.votes': 1
				}
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result);
			});
		}
	};

	this.getPolls = function(req, res) {
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		if (query.query === undefined) {
			Poll
				.find({
					'author_id': req.user._id
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
		else {
			Poll
				.findOne({
					'_id': query.query
				}, {
					'__v': false
				})
				.exec(function(err, result) {
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
				res.json('DELETED');
			})
	};

	this.getUser = function(req, res) {
		Users
			.findOne({
				'_id': req.user._id
			}, {
				'__v': false
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json(result);
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

	this.deleteUser = function(req, res) {
		Users
			.findOneAndRemove({
				'_id': req.user._id
			})
			.exec(function(err, result) {
				if (err) {
					throw err;
				}

				res.json('DELETED');
			});
	};

}

module.exports = ClickHandler;
