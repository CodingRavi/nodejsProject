var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/final");
var commentSchema = mongoose.Schema({
  Comment:String,
  author:{
    type : mongoose.Schema.Types.ObjectId, ref : 'user'
  }
});
module.exports = mongoose.model('comment', commentSchema);

