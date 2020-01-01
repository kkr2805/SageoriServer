// sageori_dao
var dbconfig = require('./dbconfig');
var mysql = require('mysql');

var dao = function(){
    this.create_connection();
    return this;
};

dao.prototype.create_connection = function(){
    var _this = this;
    this.conn = mysql.createConnection(dbconfig);   
    this.conn.on('error', function(err){
        console.log(err.code);
        _this.create_connection();
    });
};

dao.prototype.get_members = function(){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('SELECT MEMBER_ID, NAME, HP, DATE_FORMAT(CREATED_DATE, \'%Y%m%d %H%i%S\') ' 
            +  'AS CREATED_DATE FROM TB_MEMBERS WHERE DELETED = "N" ORDER BY NAME ASC', function(err, rows){
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

dao.prototype.update_member = function(member){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('UPDATE TB_MEMBERS SET NAME = "' + member.Name +  '", HP = "' + member.HP
            + '" WHERE MEMBER_ID = "' + member.ID + '" ', function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to update data. member : " + member.Name);
                resolve();
            });
    });

    return promise;
};

dao.prototype.delete_member = function(member){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('UPDATE TB_MEMBERS SET DELETED = "Y'
            + '" WHERE MEMBER_ID = "' + member.ID + '" ', function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to delete data. member : " + member.ID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.get_machines = function(){ var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('SELECT MACHINE_ID FROM TB_MACHINE', function(err, rows){
            if(err){
                reject(err);            
            }
            
            rsltArray = [];
            rows.map(function(row){
                rsltArray.push(row['MACHINE_ID']);
            });

            console.log(rsltArray);
            resolve(rsltArray);
        }); 
    });

    return promise;
};

dao.prototype.get_publishes = function(params){ var _this = this;
    var promise = new Promise(function(resolve, reject){
        var sql_query = 'SELECT A.PUBLISH_ID, A.MACHINE_ID, B.NAME AS MEMBER_NAME, A.MEMBER_ID, A.CREDIT, A.BANK, IMAGE_FILE, DATE_FORMAT(A.CREATED_DATE, \'%Y%m%d %H%i%S\') ' 
            +  'AS CREATED_DATE FROM TB_PUBLISHES AS A LEFT JOIN TB_MEMBERS AS B ON A.MEMBER_ID = B.MEMBER_ID WHERE A.DELETED = "N" /*AND B.DELETED = "N"*/';

        if(params.MachineID){
            sql_query += ' AND A.MACHINE_ID = ' + params.MachineID;
        }

        if(params.MemberID){
            sql_query += ' AND A.MEMBER_ID = ' + params.MemberID;
        }

        if(params.Date){
            sql_query += ' AND DATE(A.CREATED_DATE) = "' + params.Date + '"';
        }else if(params.DateStart && params.DateEnd){
            sql_query += ' AND DATE(A.CREATED_DATE) BETWEEN DATE("'+ params.DateStart + '") AND DATE("' + params.DateEnd + '")';
        }else{
            sql_query += ' AND DATE(A.CREATED_DATE) = DATE(NOW())';
        }

        sql_query += ' ORDER BY A.CREATED_DATE DESC ';
        console.log(sql_query);

        _this.conn.query(sql_query, function(err, rows){
            if(err){
                reject(err);            
            }

            console.log(rows);
            resolve(rows);
        }); 
    });

    return promise;
};

dao.prototype.create_publish = function(publish){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('INSERT INTO TB_PUBLISHES (MACHINE_ID, MEMBER_ID, CREDIT, BANK, IMAGE_FILE, CREATED_DATE) VALUES('
            + publish.MachineID + ', '
            + publish.MemberID + ', ' + publish.Credit + ', '
            + publish.Bank + ', "'
            + publish.Imagefile + '", '
            + ' NOW())', function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to insert data. publish : " + publish.MemberID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.update_publish = function(publish){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        var query = 'UPDATE TB_PUBLISHES SET MACHINE_ID = ' + publish.MachineID +  ', MEMBER_ID = ' + publish.MemberID + ', CREDIT = ' + publish.Credit + ', BANK = ' + publish.Bank

        if(publish.Imagefile){
            query = query + ', IMAGE_FILE = "' + publish.Imagefile + '"';
        }

        query = query + ' WHERE publish_ID = ' + publish.ID + ' ';
        
        _this.conn.query(query, function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to update data. publish : " + publish.MemberID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.delete_publish = function(publish){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('UPDATE TB_PUBLISHES SET DELETED = "Y'
            + '" WHERE publish_ID = ' + publish.ID, function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to delete data. publish : " + publish.ID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.get_return_items = function(params){ var _this = this;
    var promise = new Promise(function(resolve, reject){

        var sql_query = 'SELECT A.RETURN_ID, A.MACHINE_ID1, A.MACHINE_ID2, B.NAME AS MEMBER_NAME, A.MEMBER_ID, A.RETURN_POINT, A.SERVICE, A.ONE_P_ONE, A.IMAGE_FILE1, A.IMAGE_FILE2, DATE_FORMAT(A.CREATED_DATE, \'%Y%m%d %H%i%S\') ' 
            +  'AS CREATED_DATE FROM TB_RETURN AS A LEFT JOIN TB_MEMBERS AS B ON A.MEMBER_ID = B.MEMBER_ID WHERE A.DELETED = "N" /*AND B.DELETED = "N"*/';

        if(params && params.MachineID){
            sql_query += ' AND (A.MACHINE_ID1 = ' + params.MachineID;
            sql_query += ' OR A.MACHINE_ID2 = ' + params.MachineID + ')';
        }

        if(params && params.MemberID){
            sql_query += ' AND A.MEMBER_ID = ' + params.MemberID;
        }

        if(params && params.Date){
            sql_query += ' AND DATE(A.CREATED_DATE) = "' + params.Date + '"';
        }else if(params && params.DateStart && params.DateEnd){
            sql_query += ' AND DATE(A.CREATED_DATE) BETWEEN DATE("'+ params.DateStart + '") AND DATE("' + params.DateEnd + '")';
        }else{
            sql_query += ' AND DATE(A.CREATED_DATE) = DATE(NOW())';
        }

        sql_query += ' ORDER BY A.CREATED_DATE DESC ';
        console.log(sql_query);

        _this.conn.query(sql_query, function(err, rows){
            if(err){
                reject(err);            
            }

            console.log(rows);
            resolve(rows);
        }); 
    });

    return promise;
};

dao.prototype.create_return_item = function(return_item){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        var query = 'INSERT INTO TB_RETURN (MACHINE_ID1, MACHINE_ID2, MEMBER_ID, RETURN_POINT, SERVICE, ONE_P_ONE, IMAGE_FILE1, IMAGE_FILE2, CREATED_DATE) VALUES('
                    + return_item.MachineID1 + ', '
                    + (return_item.MachineID2 || 0) + ', '
                    + return_item.MemberID + ', '
                    + return_item.Return + ', '
                    + return_item.Service + ', '
                    + return_item.OnePone + ', '
                    + '"' + return_item.Imagefile1 + '", '
                    + '"' + return_item.Imagefile2 + '", '
                    + ' NOW())';

        console.log(query);

        _this.conn.query(query, function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to insert data. return item : " + return_item.MemberID);
                resolve();
            });
    });

    return promise;
}; 

dao.prototype.update_return_item = function(return_item){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        var query = 'UPDATE TB_RETURN SET MACHINE_ID1 = ' + return_item.MachineID1 
                    + ', MACHINE_ID2 = ' + (return_item.MachineID2 || 0) 
                    + ', MEMBER_ID = ' + return_item.MemberID 
                    + ', RETURN_POINT = ' + return_item.Return
                    + ', SERVICE = ' + return_item.Service
                    + ', ONE_P_ONE = ' + return_item.OnePone;

        if(return_item.Imagefile1){
            query = query + ', IMAGE_FILE1 = "' + return_item.Imagefile1 + '"';
        }

        if(!return_item.MachineID2){
            query = query + ', IMAGE_FILE2 = ""';
        }else if(return_item.MachineID2 && return_item.Imagefile2){
            query = query + ', IMAGE_FILE2 = "' + return_item.Imagefile2 + '"';
        }

        query = query + ' WHERE RETURN_ID = ' + return_item.ID + ' ';

        console.log(query);

        _this.conn.query(query, function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to update data. return_item : " + return_item.MemberID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.delete_return_item = function(return_item){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('UPDATE TB_RETURN SET DELETED = "Y'
            + '" WHERE RETURN_ID = ' + return_item.ID, function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to delete data. return_item : " + return_item.ID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.get_score_items = function(){ var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('SELECT MEMBER_ID, NAME AS MEMBER_NAME' 
            + ', (SELECT COALESCE(SUM(CREDIT), 0) + COALESCE(SUM(BANK), 0) FROM TB_PUBLISHES AS B WHERE A.MEMBER_ID = B.MEMBER_ID AND B.DELETED = "N" AND DATE(B.CREATED_DATE) < CURDATE()) - ' 
            + '(SELECT COALESCE(SUM(RETURN_POINT), 0) FROM TB_RETURN AS C WHERE A.MEMBER_ID = C.MEMBER_ID AND C.DELETED = "N" AND DATE(C.CREATED_DATE) < CURDATE()) - '
            + '(SELECT COALESCE(SUM(EXCHANGE), 0) FROM TB_EXCHANGE AS D WHERE A.MEMBER_ID = D.MEMBER_ID AND D.DELETED = "N" AND DATE(D.CREATED_DATE) < CURDATE())'
            + ' AS SCORE'
            + ', (SELECT SUM(CREDIT) + SUM(BANK) FROM TB_PUBLISHES AS B WHERE A.MEMBER_ID = B.MEMBER_ID AND B.DELETED = "N" AND DATE(B.CREATED_DATE) = CURDATE()) AS PUBLISH'
            + ', (SELECT SUM(RETURN_POINT) FROM TB_RETURN AS C WHERE A.MEMBER_ID = C.MEMBER_ID AND C.DELETED = "N" AND DATE(C.CREATED_DATE) = CURDATE()) AS RETURN_POINT' 
            + ', (SELECT SUM(EXCHANGE) FROM TB_EXCHANGE AS D WHERE A.MEMBER_ID = D.MEMBER_ID AND D.DELETED = "N" AND DATE(D.CREATED_DATE) = CURDATE()) AS EXCHANGE'
            + ' FROM TB_MEMBERS AS A WHERE A.DELETED = "N" ORDER BY NAME ASC', function(err, rows){
            if(err){
                reject(err);            
            }

            console.log(rows);
            resolve(rows);
        }); 
    });

    return promise;
};

dao.prototype.get_score_item = function(memberID){
    var _this = this;
    console.log(memberID);
    var promise = new Promise(function(resolve, reject){
        var query = 'SELECT MEMBER_ID, NAME AS MEMBER_NAME' 
                    + ', (SELECT COALESCE(SUM(CREDIT), 0) + COALESCE(SUM(BANK), 0) FROM TB_PUBLISHES AS B WHERE A.MEMBER_ID = B.MEMBER_ID AND B.DELETED = "N" AND DATE(B.CREATED_DATE) < CURDATE()) - ' 
                    + '(SELECT COALESCE(SUM(RETURN_POINT), 0) FROM TB_RETURN AS C WHERE A.MEMBER_ID = C.MEMBER_ID AND C.DELETED = "N" AND DATE(C.CREATED_DATE) < CURDATE()) - '
                    + '(SELECT COALESCE(SUM(EXCHANGE), 0) FROM TB_EXCHANGE AS D WHERE A.MEMBER_ID = D.MEMBER_ID AND D.DELETED = "N" AND DATE(D.CREATED_DATE) < CURDATE())'
                    + ' AS SCORE'
                    + ', (SELECT SUM(CREDIT) + SUM(BANK) FROM TB_PUBLISHES AS B WHERE A.MEMBER_ID = B.MEMBER_ID AND B.DELETED = "N" AND DATE(B.CREATED_DATE) = CURDATE()) AS PUBLISH'
                    + ', (SELECT SUM(RETURN_POINT) FROM TB_RETURN AS C WHERE A.MEMBER_ID = C.MEMBER_ID AND C.DELETED = "N" AND DATE(C.CREATED_DATE) = CURDATE()) AS RETURN_POINT' 
                    + ', (SELECT SUM(EXCHANGE) FROM TB_EXCHANGE AS D WHERE A.MEMBER_ID = D.MEMBER_ID AND D.DELETED = "N" AND DATE(D.CREATED_DATE) = CURDATE()) AS EXCHANGE'
            + ' FROM TB_MEMBERS AS A WHERE'; 

            if(memberID){
                query = query + ' A.MEMBER_ID = "' + memberID + '"'
            }

        console.log(query);

        _this.conn.query(query, function(err, rows){
            if(err){
                reject(err);            
            }

            console.log(rows);
            resolve(rows);
        }); 
    });

    return promise;
};

dao.prototype.get_exchanges = function(member_id){ 
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('SELECT A.EXCHANGE_ID, B.NAME AS MEMBER_NAME, A.MEMBER_ID, A.EXCHANGE, DATE_FORMAT(A.CREATED_DATE, \'%Y%m%d %H%i%S\') ' 
            +  'AS CREATED_DATE FROM TB_EXCHANGE AS A JOIN TB_MEMBERS AS B ON A.MEMBER_ID = B.MEMBER_ID WHERE A.MEMBER_ID = ' + member_id + ' AND A.DELETED = "N" AND DATE(A.CREATED_DATE) = CURDATE()', function(err, rows){
            if(err){
                reject(err);            
            }

            console.log(rows);
            resolve(rows);
        }); 
    });

    return promise;
};

dao.prototype.create_exchange = function(exchange){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('INSERT INTO TB_EXCHANGE (MEMBER_ID, EXCHANGE, CREATED_DATE) VALUES('
            + exchange.MemberID + ', ' + exchange.Exchange + ', '
            + ' NOW())', function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to insert data. exchange : " + exchange.MemberID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.update_exchange = function(exchange){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('UPDATE TB_EXCHANGE SET MEMBER_ID = ' + exchange.MemberID + ', EXCHANGE = ' + exchange.Exchange 
            + ' WHERE exchange_ID = ' + exchange.ID + ' ', function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to update data. exchange : " + exchange.MemberID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.delete_exchange = function(exchange){
    var _this = this;
    var promise = new Promise(function(resolve, reject){
        _this.conn.query('UPDATE TB_EXCHANGE SET DELETED = "Y'
            + '" WHERE EXCHANGE_ID = ' + exchange.ID, function(err){
                if(err){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to delete data. exchange : " + exchange.ID);
                resolve();
            });
    });

    return promise;
};

dao.prototype.confirm_admin = function(password){

    var _this = this;
    var promise = new Promise(function(resolve, reject){
        var query = 'SELECT COUNT(USER_ID) AS USER_COUNT FROM TB_USERS WHERE USER_ID = "ADMIN" AND USER_PASSWORD = PASSWORD("' 
            + password
            +  '");';
        console.log(query);
        _this.conn.query(query, function(err, rows){

                console.log(rows);

                if(err || !rows || rows.length == 0 || rows[0].USER_COUNT == 0){
                    reject(err);
                    return;
                }

                console.log("[DB] Success to confirm admin.");
                resolve();
            });
    });

    return promise;
};

module.exports = new dao();
