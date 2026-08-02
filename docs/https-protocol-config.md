---
title: 将博客的http协议更改为https
lang: zh-CN
description: change http to https
date: '2022-03-06 05:10:00'
sidebar: 'auto'
meta:
 - name: description
   content: 将博客的http协议更改为https
 - name: keywords
   content: https http
categories:
 - 博客
 - 部署运维
tags:
 - https协议
---

> 新部署的博客上线一周了，但是依旧是使用http协议，虽然也没什么问题，但总归会觉得有些不安全，所以打算把协议换一下

## 1.申请SSL证书  
这里涉及到证书的概念，我的服务器使用腾讯云的，需要申请一个SSL证书，这里可以申请一个免费的
### 1.1 登陆到腾讯云的控制台
入口其实太难找了，可以搜索`SSL`直接到我的证书页面下

### 1.2 申请免费证书
这里填写好`证书绑定域名`/`申请邮箱`等等信息，等待机构签发就可以

### 1.3 下载证书
已签发的证书下载到本地，由于我使用的是Tomcat服务器，所以选择Tomcat的下载，这里有两种可选，`pfx`和`JKS`的，这里我选择`Tomcat（JKS格式）`的，貌似都差不多

## 2.登陆到服务器
### 2.1 将JKS文件上传到服务器
以我的为例，上传到Tomcat的`conf`目录下

### 2.2 修改conf/server.xml文件
增加一个`Connector`，用过网上的版本，发现会报错，参考了一些文章的做法，把`defaultSSLHostConfigName`以及`SSLHostConfig`的`hostName`配置上就可以了，`certificateKeystoreFile`填证书路径，`certificateKeystorePassword`填证书的密码  
第二个`Connector`的`redirectPort`也需要和第一个的端口一致
```xml
<Connector port="443" protocol="HTTP/1.1" SSLEnabled="true"
           maxThreads="150" scheme="https" secure="true"
           clientAuth="false" sslProtocol="TLS"
           defaultSSLHostConfigName="emo-madao.top">
    <SSLHostConfig hostName="emo-madao.top">
            <Certificate
                    certificateKeystoreFile="conf/emo-madao.top.jks"
                    certificateKeystorePassword="your password" />
    </SSLHostConfig>
</Connector>

<Connector port="80" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="443" />					
```

### 2.3 修改容器的端口映射
增加端口`443`在容器中，这是https的默认端口，同时也要检查一下服务器的防火墙是否有放行这个端口
可以参考之前修改端口映射的文章：[这里](/modify-docker-port)  

关闭docker服务：
```shell
docker stop tomcat
systemctl stop docker
```

然后主要是修改两个文件：  

`hostconfig.json`
```json
"PortBindings":{"443/tcp":[{"HostIp":"","HostPort":"443"}],"80/tcp":[{"HostIp":"","HostPort":"80"}]}
```

`config.v2.json`
```json
"ExposedPorts":{"443/tcp":{},"80/tcp":{}}
```

启动服务：
```shell
systemctl start docker
docker start tomcat
```

之后再访问https的地址就OK了～
