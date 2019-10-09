// web.js

var express = require('express')
var app = express();
var path = require('path')
var bodyParser = require('body-parser')
var dao = require('./sageori_dao')

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
    var p = dao.get_members();
    p.then(function(result){
        res.send(result);
    });
});

app.post('/api/create_member', function(req, res){
    var member = req.body;
    var name = member.Name;
    var phone = member.HP;
    console.log("[POST: /api/create_member]" + name + ", " + phone);

    var p = dao.create_member(member);
    p.then(function(){
        res.send({result: 0});
    }, function(err){
        console.log(err);

        res.send({result: -1});
    });

});

// server
var port = 3000;
app.listen(port, function(){
    console.log('listening on port ' + port);
});
