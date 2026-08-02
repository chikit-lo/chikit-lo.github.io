---
title: MySQL踩坑记录
lang: zh-CN
description: MySQL troblesome
date: '2020-10-21 00:00:00'
sidebar: 'auto'
meta:
 - name: description
   content: MySQL踩坑记录
 - name: keywords
   content: MySQL
categories:
 - 数据库
tags:
 - MySQL
---
> MySQL问题在使用的过程中问题多多，试到过是版本问题的，也有的原因是配置没配好，反正就很折腾，我把遇到的问题及解决方案汇总如下，渐进式更新

## 1045 - Access denied for user 'root'@...
虚拟机上用docker安装的镜像，另一台主机连接该服务时报了权限问题，解决方法是赋权，开发时我给所有ip授权了，根据实际需要可以替换`%`为具体的ip：
```shell
docker exec -it mysql /bin/bash
mysql -u root -p
mysql> grant all privileges on *.* to 'root'@'%' identified by 'root';
mysql> flush privileges;
```