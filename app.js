var express = require('express');
var app = express();

//set view//
app.set('view engine', 'ejs');
//access static files//
app.use(express.static('assets'));

//access mongodb PW//
var config = require('./config');

var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));


//for authentication you need cookie parser and bcrypt//
//Cookie Parser//
var cookieParser = require('cookie-parser');
app.use(cookieParser(config.cookie_secret));

//Bcrypt for password hashing//
var bcrypt = require('bcrypt');
const saltRounds = 10;

app.get('/', function(req, res){
  db.collection('Blog').find({}).toArray(function(err,result){
    if (err) throw err;
    console.log(result);
    res.render('index', {blog: result});
  });
});


app.get('/create', function(req, res){
  res.render('create');
});


app.post('/create', function(req, res){
  console.log("I am in create post");
  var title= req.body.title;
  var content= req.body.content;
  var date= new Date();
  console.log(title);
  console.log(content);
  console.log(date);
  db.collection('Blog').insertOne({'Title': title, 'Content': content, 'Date': date}, function(err, result){
    if (err) throw err
    console.log("item successfully added to database");
    res.redirect('/');
  });
});

app.get('/edit/:edit', function(req,res){
  console.log("edit called");
  var o_id = new mongo.ObjectId(req.params.blog)
  console.log(o_id);

});

/*Create A full view blog post with the blog post title as the permalink*/
app.get('/fullPost/:blog', function(req,res){
  console.log("get full post called");
  var o_id = new mongo.ObjectID(req.params.blog);
  console.log(o_id);
  db.collection('Blog').findOne({"_id": o_id}, function(err, result){
    if (err) throw err;
    console.log("result is:" + result);
    console.log("Title is:" + result.Title);
    res.render('fullPost', {Full:result});
  });
});

MongoClient.connect(config.mongo_uri, function(err, database){
  if (err) throw err;
  console.log('succesfully connected to database');
  db = database;
  app.listen(3000, function(){
    console.log('succesfully connected to the server');
  });
});
