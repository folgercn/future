



# 交易平台


## 基础服务

* nsqjs
* redis
* mongodb
* docker 隔离钱包
## 技术栈
* socket.io
* koa
* angular

## 交易设计
* http-post => nsq => trader core
* success => client
* failed  => as order => client

## bitcoin deposit 

* generate 100k Address	
* get insight API && blockchain info 
* get desposit info
* deposit success

## bitcoin withdraw 

* Security Client get withdraw list
* get all balance info && trade info
* bitcoin wallet process withdraw