---
title: 部署VuePress到Tomcat服务器
lang: zh-CN
description: deploy vuepress to tomcat
date: '2021-12-31 17:56:00'
sidebar: 'auto'
meta:
 - name: description
   content: 部署VuePress到Tomcat服务器
 - name: keywords
   content: VuePress Tomcat
categories:
 - 部署运维
 - 博客
tags:
 - VuePress
 - Tomcat
---

> 今年双11腾讯云服务器新人价38一年，充了3年，刚好可以把GitHub pages的静态博客部署到服务器

## 安装和配置Tomcat
### 1.拉取镜像
腾讯云的服务器已经预装了docker，可以直接从docker拉取tomcat：
```shell
docker pull tomcat # 拉取tomcat镜像
```

### 2.容器操作
```shell
docker run --name tomcat -p 8080:8080 -v /root/webapps:/usr/local/tomcat/webapps -d tomcat # 运行容器并挂载卷
docker exec -it tomcat /bin/bash # 进入容器
cp conf/server.xml webapps # 将tomcat配置文件复制到webapps共享目录,方便后续修改
```

### 3.将vuepress的dist目录发送到服务器(以我的macOS为例)
```shell
scp -r Desktop/vuepress-blog/docs/.vuepress/dist/* root@[ip address]:/root/webapps/vuepress # 远程复制目录
```

### 4.修改host主机的tomcat server.xml(如果需要的话)
```shell
vi webapps/server.xml # 修改端口等等
# Host标签下加入以下一行, 因为工程放在了webapps/vuepress下
# <Context path="" docBase="vuepress" />

docker cp webapps/server.xml tomcat:/usr/local/tomcat/conf # 替换docker里tomcat的配置
```

### 5.重启docker的tomcat
```shell
docker restart tomcat # 重启tomcat容器
```

### 6.随手测试一下能否用呗
```shell
curl emo-madao.top:8080
```
