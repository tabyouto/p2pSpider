'use strict';

var sqlAction = require("./mysql.js"); //mysql 配置文件
var redis = require("redis");
var flag= require('./store');
var event = require('./event');
var client = redis.createClient();
var i = 0;
function sql() {
	client.lrange('p2pData', 0, 0, function(err, reply) {
		console.log(reply); // ['angularjs', 'backbone']
		if(reply.length) {
			client.LPOP('p2pData',function(v) {
				sqlAction.insert('INSERT IGNORE INTO list(name,magnet,infoHash,size,catch_date,hot,download_count,file_number,content_file) VALUES ?',[JSON.parse(v[0])],function (err, vals, fields) {
					sql();
				});
			});
		}else {
			flag = true;
		}
	});
}
event.on('empty',function(v) {
	if(v) {
		sql();
	}
});

