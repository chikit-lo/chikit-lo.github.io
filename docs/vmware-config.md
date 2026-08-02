---
title: VMware配置虚拟机静态ip地址
lang: zh-CN
description: VMware config static ip
date: '2020-10-21 00:00:00'
sidebar: 'auto'
meta:
 - name: description
   content: VMware配置虚拟机静态ip地址
 - name: keywords
   content: VMware
categories:
 - 部署运维
tags:
 - VMware
---

> 在使用虚拟机的时候，为了方便其他局域网内的机器访问里面的资源，我会把虚拟机设置固定ip，VMware我安装在Windows系统中，以Windows系统为例，完成相关配置

## 1.Windows宿主机配置VMware Network Adapter VMnet8网卡
以Windows10为例，在`网络和Internet`设置项里面找到`更改适配器选项`，打开并修改`VMware Network Adapter VMnet8`的属性，在IPv4的属性项里面修改如下：  
IP地址：192.168.142.1  
子网掩码：255.255.255.0  
默认网关：192.168.142.2  
首选DNS服务器：114.114.114.114  
备用DNS服务器：8.8.8.8

## 2.VMware虚拟机网络编辑器配置
打开VMware的`虚拟机网络编辑器`，点击`VMnet8`的网卡，类型改为`NAT模式`，下面的`子网IP`设置为`192.168.142.0`，子网掩码设置为`255.255.255.0`；
点击`NAT设置`，把`网关IP`改为上面配置的`192.168.142.2`，另外，端口转发的配置项在使用docker时也需要配置的，在[docker](/docker101)的这篇文章会有体现

## 3.进入虚拟机配置网络
以CentOS7为例：
```shell
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

打开后需要修改以下六个参数：
```shell
BOOTPROTO="static"
IPADDR="192.168.142.180"
NETMASK="255.255.255.0"
GATEWAY="192.168.142.2"
DNS1="114.114.114.114"
DNS2="8.8.8.8"
```
修改完之后保存退出，并重启网络：
```shell
service network restart
```