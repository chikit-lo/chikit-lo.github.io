---
title: Docker备忘录
lang: zh-CN
description: Docker note
date: '2020-10-21 00:00:00'
sidebar: 'auto'
meta:
 - name: description
   content: Docker备忘录
 - name: keywords
   content: Docker
categories:
 - 部署运维
tags:
 - Docker
---
> 在微服务的开发练习时候往往会用到虚拟机，而Docker则方便我们管理各种镜像资源，虚拟机中的虚拟机

## 1.Docker的安装
以CentOS7为例：
```shell
yum install docker # 安装Docker
systemctl start docker # 启动Docker
systemctl enable docker # 将Docker服务设为开机启动
```

## 2.基操
### 2.1 镜像操作
```shell
docker serach 镜像名 # 检索镜像
docker pull 镜像名[:tag] # 拉取镜像，[:tag]可选，tag代表软件版本，默认为latest
docker images # 查看所以本地镜像
docker rmi IMAGE_ID # 根据image id删除本地镜像
```

### 2.2 容器操作
#### 2.2.1 容器常用命令
```shell
docker run --name CONTAINER_NAME -d IMAGE_NAME -p 8080:8080 # 运行容器，IMAGE_NAME：指定镜像模板；--name：自定义容器名CONTAINER_NAME；-d：后台运行；-p：主机端口:容器内部端口
docker ps # 查看运行中的容器
docker ps -a # 查看所有容器
docker start CONTAINER_NAME/CONTAINER_ID # 启动容器
docker stop CONTAINER_NAME/CONTAINER_ID # 停止容器
docker rm CONTAINER_NAME/CONTAINER_ID # 删除容器
docker logs CONTAINER_NAME/CONTAINER_ID # 查看容器日志
docker exec -it CONTAINER_NAME/CONTAINER_ID /bin/bash # 进入到容器
```

#### 2.2.2 容器参数解析
```shell
-t # 在新容器内指定一个伪终端或终端
-i # 允许对容器内的标准输入 (STDIN) 进行交互
-d # 默认不会进入容器，容器启动后会进入后台
-P # 将容器内部使用的网络端口随机映射到我们使用的主机上
-f # 让 docker logs 像使用 tail -f 一样来输出容器内部的标准输出
-v # 挂载目录到容器
```

#### 2.2.3 常用镜像容器运行
Tomcat：
```shell
docker run --name tomcat -p 80:80 -p 443:443 -v /root/webapps:/usr/local/tomcat/webapps -v /root/conf:/usr/local/tomcat/conf -d tomcat
```

MySQL的容器在运行的时候需要指定密码，以我安装的5.7版本为例：
```shell
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:5.7.32
```

若容器需要开机自动启动或取消自动启动，则可以使用如下指令：
```shell
docker update mysql --restart=always # 开机自动启动
docker update mysql --restart=no # 取消开机自动启动
```

安装redis
```shell
docker run -itd --name redis -p 6379:6379 redis
```

安装mongodb
```shell
docker run -itd --name mongo -p 27017:27017 mongo
```

安装rabbitmq
```shell
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.8.9-management
```

#### 2.2.4 更新镜像
在更新镜像之前，先需要启动容器，然后在容器内执行：
```shell
apt-get update
exit # 更新完成后退出容器
docker commit CONTAINER_ID REPOSITORY:TAG
```

#### 2.2.5 容器与主机之间数据拷贝
```shell
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH
docker cp [OPTIONS] SRC_PATH CONTAINER:DEST_PATH
OPTIONS: -L:保持源目标中的链接
```

## 3.使用国内镜像加速下载速度
修改`/etc/docker/daemon.json`文件：
```shell
vi /etc/docker/daemon.json
# 将下面内容添加到这个文件中
{
  "registry-mirrors": ["https://hccwwfjl.mirror.aliyuncs.com"]
}
```

## 4.与VMware端口映射
由于我是使用两台计算机进行学习和练习，其中一台安装了虚拟机的宿主机需要配置防火墙的入站规则以便另外局域网内的机器访问：  
这台宿主机是Windows10系统，在系统设置中，找到`网络和Internet`，点击`Windows防火墙`，找到`高级设置`，里面的`入站规则`中新建一个规则：  
- `规则类型`选择`自定义`，下一步，
- `程序`选择`所有程序`，下一步，
- `协议和端口`保持默认任何，下一步，
- `作用域`的本地IP地址中我添加了局域网内的主机ip，下一步，
- `操作`选择`允许连接`，下一步，
- `配置文件`默认选中所有，下一步，`名称`取一下即可，添加完成后启动规则即可

打开VMware的`虚拟机网络编辑器`，点击`VMnet8`的网卡，点击`NAT设置`，`端口转发`中添加一些应用程序的访问规则，例如MySQL的：  
主机端口：3306，类型：TCP，虚拟机IP地址：192.168.142.180:3306  
这样，在局域网的主机就能通过连接宿主机的ip来访问到虚拟机里面docker容器的数据库了，注意的是连接`宿主机`的ip，并非`虚拟机`的
