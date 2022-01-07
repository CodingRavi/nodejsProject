var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/final");
var postSchema = mongoose.Schema({
  capsion:String,
  image:String,
  author:{
    type : mongoose.Schema.Types.ObjectId, ref : 'user'
  },
  likes:[{ 
    type : mongoose.Schema.Types.ObjectId, ref : 'user'
  }],
  comments:[{ 
    type : mongoose.Schema.Types.ObjectId, ref : 'user'
  }],
  report:[{ 
    type : mongoose.Schema.Types.ObjectId, ref : 'user'
  }],
});
module.exports = mongoose.model('post', postSchema);