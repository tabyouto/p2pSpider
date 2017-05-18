'use strict';

var mysql = require('mysql');
var config = require('./config');
console.log(config)
var pool = mysql.createPool(config);



var sqlAction = {
    query: function (sql, x, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, x, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    var _res = JSON.parse(JSON.stringify(vals));
                    callback(qerr, _res, fields);
                });
            }
        })
    },
    insert: function (sql, x, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, x, function (qerr, vals, fields) {
                    conn.release();
                    // console.log(vals);
                    // var _res = JSON.parse(JSON.stringify(vals));
                    //console.log(_res);
                     callback(qerr, fields);
                });
            }
        })
    }
};
  
module.exports = sqlAction;
  
