# moon
mp4 loader balance

now data structure:

Key : resource <hash>: path:存储路径 uri:请求路径，可以为中文

Key : server <hash> name:服务名 host:(IP:port) link:当前持有链接数 status:服务状态

Key : request:(resource.uri) <zset>  时间戳 - 服务IP:PORT

Key : server_link <zset> 当前持有链接数 - 服务IP:PORT
