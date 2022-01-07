var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/final");
var passportLocalMongoose  =require('passport-local-mongoose');
var userSchema = mongoose.Schema({
  username :String,
  email:String,
  password :String,
  posts:[{
    type : mongoose.Schema.Types.ObjectId, ref : 'post'
  }]
  
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', userSchema);

