---
title: MacOS配置SSH免密登陆GitHub
lang: zh-CN
description: MacOS config ssh to GitHub
date: '2020-09-30 00:00:00'
sidebar: 'auto'
meta:
 - name: description
   content: MacOS配置SSH免密登陆GitHub
 - name: keywords
   content: SSH
categories:
 - 部署运维
tags:
 - GitHub
 - SSH
---

> 使用SSH协议可以连接远程服务器和服务并向它们验证。利用SSH密钥可以连接GitHub，而无需在每次访问时提供用户名或密码。在部署VuePress到GitHub的时候踩坑了，报错信息是没有权限或者没有找到仓库，但仓库是建了的，所以是没有登陆权限，需要配置一下，这里我以MacOS为例

报错信息如下：
```shell
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

### 1.先检查一下电脑是否已经有SSH keys
在终端里面输入以下命令：
```shell
ls -al ~/.ssh
```
看看打印的结果是否包含有`.pub`后缀的文件，若没有，则进入第2步，若已存在，则跳到第3步


### 2.生成密钥
#### 2.1 ssh-keygen
在终端输入以下命令，最后的参数是关联GitHub的邮箱：
```shell
ssh-keygen -t rsa -b 4096 -C "<GitHub绑定的邮箱>"
```
然后一路回车：
```shell
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/jacklo/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/jacklo/.ssh/id_rsa.
Your public key has been saved in /Users/jacklo/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:Jf9jJTx7sopMzA2qT0FKIdLm/MEjxAPKFDhfxKUsLS0 312321720@qq.com
The key's randomart image is:
+---[RSA 4096]----+
|+*ooo..          |
|*.*=oo           |
|.OE+* . . .      |
|  ==+o   + .     |
|   o.o. S . + .  |
|    .  = o . =   |
|      o + . * .  |
|     o o . . =   |
|    ... o ...    |
+----[SHA256]-----+
```

#### 2.2 将SSH key添加至ssh-agent
```shell
eval $(ssh-agent -s) # 在后台启动 ssh 代理
```

#### 2.3 把密钥添加到ssh-agent的高速缓存中
```shell
ssh-add -K ~/.ssh/id_rsa
```


### 3.将公钥保存到GitHub
打开id_rsa.pub文件，将里面的内容复制一下：
```shell
view ~/.ssh/id_rsa.pub
```
登陆GitHub->Settings->SSH and GPG keys->New SSH key， `Title`改一下，然后把控制台复制的内容粘贴到`Key`中，最后`Add SSH key`


### 4.测试连接
```shell
ssh -T git@github.com
Hi chikit-lo! You've successfully authenticated, but GitHub does not provide shell access.
```
终端打印类似信息即可，对于Windows或其他系统做法可能稍微有点差异，附上官方的解决方案：[使用 SSH 连接到 GitHub](https://docs.github.com/cn/authentication/connecting-to-github-with-ssh)