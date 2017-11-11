var express = require('express');
var app = express();

//set view//
app.set('view engine', 'ejs');
//access static files//
app.use(express.static('assets'));

//access mongodb PW//
var config = require('./config.secret');

const expressMongoDb = require('express-mongo-db');
app.use(expressMongoDb(config.mongo_uri));


var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));


//for authentication you need cookie parser and bcrypt//
//Cookie Parser//
var cookieParser = require('cookie-parser');
app.use(cookieParser(config.cookie_secret));

//Bcrypt for password hashing//
var bcrypt = require('bcryptjs');
const saltRounds = 10;


app.get('/', function(req, res){
    req.db.collection('Blog').find({}).toArray(function(err,result){
    if (err) throw err;
    console.log(result);
    res.render('index', {blog: result});
  });
});

//load create page only if user is logged in//
app.get('/create', function(req, res){
  console.log('Cookies:', req.cookies);
  console.log("signed cookie:", req.signedCookies);
  if (req.signedCookies.userid !== undefined){
    res.render('create');
  }
  else{
    res.redirect('/login');
  }
});


//insert blog post into DB then display new blog post on home page//
app.post('/create', function(req, res){
  console.log("I am in create post");
  var title= req.body.title;
  var content= req.body.content;
  var date= new Date();
  /*var signed = cookies.get( "signed", { signed: true } )*/
  var signed = req.signedCookies.userid;
  console.log(title);
  console.log(content);
  console.log(date);
  console.log("this is the userID cookie:" + signed);
  req.db.collection('Blog').insertOne({'Title': title, 'Content': content, 'Date': date, 'UserId': ObjectId(signed)}, function(err, result){
    if (err) throw err;
    console.log("item successfully added to database");
    res.redirect('/');
  });
});

//Open blog in edit mode to edit an existing blog post//
app.get('/edit/:edit', function(req,res){
  console.log("edit/:edit called");
  var o_id = new mongo.ObjectId(req.params.edit)
  console.log(o_id);
  req.db.collection('Blog').findOne({"_id": o_id}, function(err, result){
    if (err) throw err;
    console.log('result is:' + result);
    console.log('Title is:' + result.Title);
    res.render('edit', {editBlog:result});
  });
});


//save the new blog edits to db//
app.post('/edit', function (req,res){
  console.log("I am about to save my new blog edits to db");
  var title = req.body.title;
  var content = req.body.content;
  var id = req.body.id;
  var date = req.body.date
  var UserId = req.signedCookies.userid;
  console.log("I made an edit and this is the UserID for the blog post:" + UserId);
  var date = new Date(date);
  req.db.collection('Blog').save({'_id':ObjectId(id),'Title': title, 'Content': content, 'Date': date, 'UserId': ObjectId(UserId)},
  function(err,result){
    if (err) throw err;
    console.log("blog has been successfully updated in the DB");
    res.redirect('/');
  });
});

//delete post//
app.delete('/fullpost/:del', function(req,res){
  console.log("delete post has been called");
  var o_id = new mongo.ObjectId(req.params.del);
  console.log(o_id);
  req.db.collection('Blog').remove({'_id':o_id}, function(err, result){
    if (err) throw err;
    console.log("blog post has been succesfully deleted from the DB");
     res.status(200).end()
  });
});

/*Create A full view blog post with the blog post title as the permalink*/
app.get('/fullpost/:blog', function(req,res){
  console.log("get full post called");
  var o_id = new mongo.ObjectID(req.params.blog);
  console.log(o_id);
  req.db.collection('Blog').findOne({"_id": o_id}, function(err, result){
    if (err) throw err;
    console.log("result is:" + result);
    console.log("Title is:" + result.Title);
    console.log("blog user id is:" + result.UserId);
    /*res.render('fullpost', {Full:result});*/
  req.db.collection('Comments').find({"Blog_id": o_id}).toArray(function(err, results){
    if (err) throw err;
    console.log(results);
    console.log(results.Comment);
    console.log(req.signedCookies.userid);
    res.render('fullpost', {Full:result, postedComment: results, User: req.signedCookies.userid});
    return;
  });
  });
});

//Post comments to blogs//
//need to complete. how can we reload fullpost after commenting??//
app.post('/fullpost', function (req,res){
  console.log("I am in comment post");
  var id = req.body.identity;
  var comment = req.body.comment;
  console.log(comment);
  console.log(id);
  req.db.collection('Comments').insertOne({'Comment': comment, 'Blog_id':ObjectId(id)}, function(err, result){
    if (err) throw err;
    console.log("comment successfully inserted into database");
    var blog = id;
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

//user log in//
app.post('/login', function(req, res){
  console.log("I am in login post");
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  req.db.collection('BlogUser').findOne({"username": username}, function(err, user){
    if(!user){
      console.log("username not found");
      res.redirect('/login');
    }
    else{
      console.log(user.password);
      console.log("the id is:" + user._id);
      bcrypt.compare(password, user.password, function(err,result){
        if(result){
          //password match//
          console.log("username and password match");
          res.cookie('userid', user._id, {signed:true});
          res.redirect('/create');
        }else {
          //passwords don't match//
          console.log('username and password do not match');
          res.redirect('/login');
        }
      });
    }
  });
});

//log user out, cookies cleared //
app.get('/logout', function(req,res){
  res.clearCookie('userid');
  console.log("logged out");
  res.redirect('/');
});



app.get('/signup', function(req,res){
  res.render('signup');
});

//new user signup //
app.post('/signup', function(req,res){
  console.log("I am in sign up Post");
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  console.log(name);
  console.log(email);
  console.log(username);
  console.log(password);
  bcrypt.hash(password, saltRounds, function(err,hash){
    req.db.collection("BlogUser").insertOne({'name': name, 'email': email, 'username':
    username, 'password': hash}, function(err, result){
      if (err) throw err;
      console.log("new user inserted to BlogUser DB");
      res.redirect('/login');
    });
  });
});


if (require.main === module) {
    app.listen(config.port, function() {
        console.log("Local server started");
    });
}

module.exports = app;
