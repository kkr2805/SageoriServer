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
        res.send({result_code: 0});
    }, function(err){
        console.log(err);

        res.send({result_code: -1});
    });

});

app.post('/api/update_member', function(req, res){
    var member = req.body;
    var id = member.ID;
    var name = member.Name;
    var phone = member.HP;
    console.log("[POST: /api/update_member]" + name + ", " + phone);

    var p = dao.update_member(member);
    p.then(function(){
        res.send({result_code: 0});
    }, function(err){
        console.log(err);

        res.send({result_code: -1});
    });

});

app.post('/api/delete_member', function(req, res){
    var member = req.body;
    var id = member.ID;
    console.log("[POST: /api/delete_member]" + id);

    var p = dao.delete_member(member);
    p.then(function(){
        res.send({result_code: 0});
    }, function(err){
        console.log(err);

        res.send({result_code: -1});
    });

});

app.get('/api/get_machines', function(req, res){
    var p = dao.get_machines();
    p.then(function(result){
        res.send(result);
    });
});

app.get('/api/get_publishes', function(req, res){
    var p = dao.get_publishes();
    p.then(function(result){
        res.send(result);
    });
});

app.post('/api/create_publish', function(req, res){
    var publish = req.body;
    var machineID = publish.MachineID;
    var memberID = publish.MemberID;
    var credit = publish.Credit;
    var bank = publish.Bank;

    console.log("[POST: /api/create_publish]" + memberID);

    var p = dao.create_publish(publish);
    p.then(function(){
        res.send({result_code: 0});
    }, function(err){
        console.log(err);

        res.send({result_code: -1});
    });

});

app.post('/api/update_publish', function(req, res){
    var publish = req.body;
    var machineID = publish.MachineID;
    var memberID = publish.MemberID;
    var credit = publish.Credit;
    var bank = publish.Bank;

    console.log("[POST: /api/update_publish]" + memberID);

    var p = dao.update_publish(publish);
    p.then(function(){
        res.send({result_code: 0});
    }, function(err){
        console.log(err);

        res.send({result_code: -1});
    });


});

app.post('/api/delete_publish', function(req, res){
    var publish = req.body;
    var id = publish.ID;
    console.log("[POST: /api/delete_publish]" + id);

    var p = dao.delete_publish(publish);
    p.then(function(){
        res.send({result_code: 0});
    }, function(err){
        console.log(err);

        res.send({result_code: -1});
    });
});

// server
var port = 3000;
app.listen(port, function(){
    console.log('listening on port ' + port);
});
