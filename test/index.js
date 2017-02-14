'use strict';

var P2PSpider = require('../lib');
var sqlAction = require("./mysql.js"); //mysql 配置文件

//var redis = require("redis");
//var sub = redis.createClient({password: 123456}),
//    pub = redis.createClient({password: 123456});

var p2p = P2PSpider({
    nodesMaxSize: 500,   // be careful
    maxConnections: 500, // be careful
    timeout: 5000
});

p2p.ignore(function (infohash, rinfo, callback) {
    // false => always to download the metadata even though the metadata is exists.
    var theInfohashIsExistsInDatabase = false;
    callback(theInfohashIsExistsInDatabase);
});

p2p.on('metadata', function (metadata) {
    var file_number = 1;
    var result = [];
    var tmpArr = [];
    var tmpObj = {
        a: '',
        b: '',
        c: '',
        d: '',
        e: '',
        f: '',
        g: '',
        h: '',
        i: ''
    };
    if(metadata.info.name) {
        tmpArr.push(metadata.info.name.toString());
        tmpObj.a = metadata.info.name.toString();
        tmpObj.b = metadata.magnet;
        tmpObj.c = metadata.infohash;
    }else {
        return;
    }
    tmpArr.push(metadata.magnet);
    tmpArr.push(metadata.infohash);

    if(metadata.info.files) {
        var ignoreCount = 0;
        var listFileSize = 0;
        var flag = false; //判断是不是无效文件
        var text = []; //多个文件名
        for(var i = 0;i < metadata.info.files.length;i++) {
            var path_name = metadata.info.files[i].path ? metadata.info.files[i].path.toString() : '';
            if(path_name.indexOf('_____padding_file') > -1) {
                ignoreCount++;
                flag = true;
            } else {
                listFileSize += parseInt(metadata.info.files[i].length);
            }
            if(!flag && text.length <=20) {
                text.push(metadata.info.files[i].path.toString());
                flag = false;
            }
        }
        console.log('原始数量',metadata.info.files.length);
        file_number = metadata.info.files.length - ignoreCount;
        tmpArr.push(listFileSize);
        tmpObj.d = listFileSize;
    }else {
        tmpArr.push(metadata.info.length);
        tmpObj.d = metadata.info.length;
    }

    tmpArr.push(new Date().getTime());
    tmpArr.push(0);
    tmpArr.push(0);
    tmpArr.push(file_number);


    tmpObj.e = new Date().getTime();
    tmpObj.f = 0;
    tmpObj.g = 0;
    tmpObj.h = file_number;
    if(text) {
        tmpArr.push(text.join(','));
        tmpObj.i = text.join(',');
    }else {
        tmpArr.push('');
        tmpObj.i = '';
    }
    var ccc = [];
    var kkk = [];
    for(var k in tmpObj) {
        ccc.push(tmpObj[k]);
    }
    kkk.push(ccc);
    //result.push(tmpArr);
    console.log(kkk);




    sqlAction.insert('INSERT IGNORE INTO list(name,magnet,infoHash,size,catch_date,hot,download_count,file_number,content_file) VALUES ?',[kkk],function (err, vals, fields) {});

});

p2p.listen(6881, '0.0.0.0');