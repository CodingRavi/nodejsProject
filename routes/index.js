var express = require('express');
const passport = require('passport');
var router = express.Router();
var UserModel = require('./users');
var commentModel = require('./comments');
var postModel = require('./posts');
const multer  = require('multer')
const localStrategy = require('passport-local');
const { request } = require('express');
const { populate } = require('./users');
passport.use(new localStrategy(UserModel.authenticate()));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  postModel.find()
  .populate("author")
  // .populate("comment")
  .then(function(post){
    console.log(post);
    res.render('index', {title:"home",post});
  })
});

router.get('/like/:id',isLoggedIn,function(req, res) {
  UserModel.findOne({username: req.session.passport.user})
  .then(function(founduser){
    postModel.findOne({_id : req.params.id})
    .then(function(post){
      if(post.likes.indexOf(founduser._id)=== -1){
        post.likes.push(founduser._id);
      }
      else{
        var index= post.likes.indexOf(founduser._id);
        post.likes.splice(index, 1)
      }
      post.save().then(function(){
        res.redirect(req.headers.referer)
      })
      
    })
    
  })
});

router.get('/report/:id',isLoggedIn,async function(req, res) {
    var user = await UserModel.findOne({username: req.session.passport.user})
    var post = await (await postModel.findOne({_id:req.params.id}))

    if(post.report.indexOf(user._id)=== -1){
      post.report.push(user._id);
    }
    else{
      var index= post.report.indexOf(user._id);
      post.report.splice(index,1)
    }

    post.save();
    res.redirect(req.headers.referer)
});
router.get('/share/:id',isLoggedIn,async function(req, res) {
  var posts = await postModel.findOne({_id:req.params.id})
  res.render("share", {title:"share",posts})
});

router.get('/delete/:id',isLoggedIn,async function(req, res) {
  var posts = await postModel.findOneAndDelete({_id:req.params.id})
  res.redirect(req.headers.referer);
});

router.post('/upload', upload.single('image'), function(req, res, next) {
  UserModel.findByUsername(req.session.passport.user).then(function(user){
    if(req.file){
      postModel.create({
        capsion:req.body.capsion,
        image:req.file.filename,
        author:user._id,
      })
      .then(function(p){
        user.posts.push(p._id);
        user.save()
      })
    }
  else{
    postModel.create({
      capsion:req.body.capsion,
      author:user._id,
    })
    .then(function(p){
      user.posts.push(p._id);
      user.save()
    })
  }
  
  res.redirect(req.headers.referer);
 })
});
router.get('/profile', isLoggedIn,function(req, res, next) {
  UserModel.findOne({username: req.session.passport.user})
  .populate("posts")
  .then(function(user){
    console.log(user)
    res.render('profile', {title:"profile",user});
  })
});

router.get('/register',function(req,res ,next){
  res.render('register', { title: 'register'});

});
router.get('/login',function(req,res ,next){
  res.render('login', { title: 'login'});

});

router.post('/register',function(req,res ,next){
  var newUser = new UserModel({
    username : req.body.username,
    email:req.body.email,
  })
  UserModel.register(newUser , req.body.password )
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.redirect("/profile");
      // res.render('profile',{u,page:"profile", loghai:true})
      
    })
  }).catch(function(e){
    res.send(e);
    console.log(e);
  })
})

router.post('/login', passport.authenticate('local',{
  successRedirect:'/profile',failureRedirect:'/'
}), function(req,res ,next){
res.redirect('/profile');
})

router.get('/logout' , function(req, res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next();

  }
  else{
    res.redirect('/login');
  }
}

// sturdy Section
router.get("/sturdy",function (req,res,next) {
  res.render("sturdy",{title:"sturdy"})
});

module.exports = router;

