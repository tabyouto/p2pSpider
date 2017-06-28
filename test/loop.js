'use strict';

let sqlAction = require("./mysql.js"); //mysql 配置文件
let redis = require("redis");
let flag= require('./store');
let event = require('./event');
let client = redis.createClient();
let i = 0;
function sql() {
	client.lrange('p2pData', 0, 0, function(err, reply) {
		console.log(reply); // ['angularjs', 'backbone']
		if(reply.length) {
			client.LPOP('p2pData',function(v) {
				sqlAction.insert('INSERT IGNORE INTO list(name,infoHash,size,catch_date,hot,download_count,file_number,content_file) VALUES ?',[JSON.parse(v[0])],function (err, vals, fields) {
					sql();
				});
			});
		}else {
			flag = true;
		}
	});
}

module.exports = sql;
