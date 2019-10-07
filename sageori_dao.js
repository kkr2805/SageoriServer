// sageori_dao
var dbconfig = require('./dbconfig');
var mysql = require('mysql');

var dao = function(){
    this.conn = mysql.createConnection(dbconfig);   
    return this;
};

dao.prototype.get_members = function(success){
    this.conn.query('SELECT MEMBER_ID, NAME, HP FROM TB_MEMBERS', function(err, rows){
        if(err)
            throw err;

        console.log(rows);

        success(rows);
    }); 
}

module.exports = new dao();
