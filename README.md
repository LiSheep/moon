#moon
视频是一个长连接的TCP因此并发连接数量往往较高，而且其主要负载在于连接数量、磁盘IO和带宽。在使用nginx的MP4模块作为视频服务，在一个4G内存的服务器测试时发现nginx最多只能并发接受800个连接，如果连接数量继续增长nginx几乎都将返回500的错误码。因此必须同时启动多个不同的mp4服务来作为服务。</br>
 因此本服务利用从视频服务器所返回的数据，指定一个可用的mp4服务器，并发送HTTP的301报文，即可无需编写负载均衡程序，只改变视频url地址，利用浏览器对301报文的掉转，即可实现重定向视频流，来实现负债均衡。</br>
<center>![](https://github.com/LiSheep/moon/blob/master/doc/img1.jpg)</center>

now data structure:
---
>Key : resource <hash>: path:存储路径 uri:请求路径，可以为中文
>Key : server <hash> name:服务名 host:(IP:port) link:当前持有链接数 status:服务状态
>Key : request:(resource.uri) <zset>  时间戳 - 服务IP:PORT
>Key : server_link <zset> 当前持有链接数 - 服务IP:PORT


PS. moon通过向服务器发送请求来获取视频服务器的状态，api请求使用RESTful：[sun](https://github.com/LiSheep/sun)


##服务器配置文件在config.json如下：
``` javascript
{
	"upload":{
		"max_size": 1073741824,
		"save_path": "E:\\WorkSpace-Node\\moon",  //上传文件保存路径，建议和nginx的目录保持一直
		"allow_type": "mp4"
	},
	"redis":{
		"port":6379,
		"host":"127.0.0.1",
		"opt":{
			"connect_timeout":3000,
			"auth_pass":""
		}
	},
	"poll":{
		"delay": 5000 //轮询服务器状态的频率，单位毫秒。
	},
	"request":{
		"max_link": 500 //每个服务器最多可以接受的请求数
	},
	"api":{ // api版本号，具体参考noderestify:https://github.com/mcavage/node-restify
		"version": "~0.0.1",
		"port": 8080
	},
	"log":{
		"mongodb": {  // mongodb存储日志
            "level": "info",
            "dbUri": "mongodb://localhost:27100/moon",
            "errorTimeout": 5000,
            "timeout": 5000
        },
        "console": {
            "level": "warn",
            "label": "moon",
            "json" : false
        },
        "file": {
            "level": "warn",
            "filename": "moon.log"
        }
	}
}
``` 
