// web.js

var express = require('express')
var app = express();
var path = require('path')
var bodyParser = require('body-parser')
var dao = require('./sageori_dao')

// middleware
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(function(req, res, next){
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
//});

// API
//app.use('/api/users', require('./api/users'));
//app.use('/api/auth', require('./api/auth'));
app.get('/api/hello', function(req, res){
    res.send({data: 'Hello world'});
});

app.get('/api/get_members', function(req, res){
    dao.get_members(function(rows){
        res.send(rows);
    });
});

// server
var port = 3000;
app.listen(port, function(){
    console.log('listening on port ' + port);
});
