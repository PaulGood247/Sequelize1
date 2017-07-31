var express = require("express");
var app     = express();
var http    = require('http');
var massive = require("massive");
var connectionString = "postgres://postgres:monkey95@localhost/pgguide";
var db      = massive.connectSync({connectionString : connectionString}) 


// users
app.get('/users', function (req, res) {
	db.users.find(function(err, result) {
		res.send(result);
	});
});

app.get('/users/:id', function (req, res) {
	db.users.find({id: req.params.id}, function(err, result) {
		res.send(result);
	});
});


// products
//app.get('/products', function (req, res) {
	//db.products.find(function(err, result) {
		//res.send(result);
	//});
//});

app.get('/products/:id', function (req, res) {
	db.products.find({id: req.params.id}, function(err, result) {
		res.send(result);
	});
});

app.get('/products', function (req, res) {
	
	let name = req.query.name;
	db.get_products([name], function(err, result){
		if(err){
			console.log(err);
		}else{
			res.send(result)
		}
	});
});


// purchases
app.get('/purchases', function (req, res) {
	db.purchases.find(function(err, result) {
		res.send(result);
	});
});

app.get('/purchases/:id', function (req, res) {
	db.purchases.find({id: req.params.id}, function(err, result) {
		res.send(result);
	});
});


app.set('db', db);
http.createServer(app).listen(8080);