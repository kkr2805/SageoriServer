// sageori_dao
var dbconfig = require('./dbconfig');
var mysql = require('mysql');

var dao = function(){
    this.conn = mysql.createConnection(dbconfig);   
    return this;
};

dao.prototype.get_members = function(){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('SELECT MEMBER_ID, NAME, HP, DATE_FORMAT(CREATED_DATE, \'%Y%m%d %H%i%S\') AS CREATED_DATE FROM TB_MEMBERS', function(err, rows){
            if(err){
                reject(err);            
            }

            console.log(rows);
            resolve(rows);
        }); 
    });

    return promise;
};

dao.prototype.create_member = function(member){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('INSERT INTO TB_MEMBERS (NAME, HP, CREATED_DATE) VALUES('
            + '"' + member.Name + '", '
            + '"' + member.HP + '", NOW())', function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to insert data. member : " + member.Name);
                resolve();
            });
    });

    return promise;
};

module.exports = new dao();
