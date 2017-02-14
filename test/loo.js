'use strict';

var sqlAction = require("./mysql.js"); //mysql 配置文件
var redis = require("redis");
var client = redis.createClient();
var i = 0;
function sql() {
	client.lrange('frameworks', 0, i, function(err, reply) {
		console.log(reply); // ['angularjs', 'backbone']
		if(reply) {
			sqlAction.insert('INSERT IGNORE INTO list(name,magnet,infoHash,size,catch_date,hot,download_count,file_number,content_file) VALUES ?',[JSON.parse(reply)],function (err, vals, fields) {
				i++;
				sql();
			});
		}
	});
}

sql();