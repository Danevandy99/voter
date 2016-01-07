'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
	author_id: String,
	name: String,
	options: Array
});

module.exports = mongoose.model('Poll', Poll);