---
title: 修改Docker端口映射参数
lang: zh-CN
description: modify docker port mapping
date: '2021-12-31 17:59:00'
sidebar: 'auto'
meta:
 - name: description
   content: 修改Docker端口映射参数
 - name: keywords
   content: Docker
categories:
 - 部署运维
tags:
 - Docker
 - Tomcat
---

> 使用docker创建tomcat容器部署应用之后忽然觉得映射了端口号每次ip后都要输入也未免太过麻烦，于是就有了这个笔记

## 修改docker的端口映射配置文件以及tomcat配置
### 1.查看容器id
```shell
docker ps
CONTAINER ID   IMAGE     COMMAND             CREATED       STATUS        PORTS                    NAMES
a488578e56e1   tomcat    "catalina.sh run"   5 weeks ago   Up 20 hours   0.0.0.0:8080->8080/tcp   tomcat
```

### 2.关闭容器和docker服务
```shell
docker stop tomcat

# 有时候关闭docker服务会提示错误, 这时候需要先把docker.socket关了
Warning: Stopping docker.service, but it can still be activated by:
  docker.socket
systemctl stop docker.socket
systemctl stop docker
```

### 3.修改hostconfig.json以及config.v2.json
```shell
# 根据第一步查到的容器id, 找到容器对应的两个配置文件, 以我的为例
ls /var/lib/docker/containers/
a488578e56e1274f16dfbe9c1d672ad50f5571e6217f2879b148450e1d0e0cdc
# 进入到该目录里, 修改hostconfig.json
cd /var/lib/docker/containers/a488578e56e1274f16dfbe9c1d672ad50f5571e6217f2879b148450e1d0e0cdc/
vi hostconfig.json
# 找到PortBindings, 并修改端口, HostPort为宿主机的ip, 前面的ip为容器内的ip
# 最后修改完的结果如下: "PortBindings":{"80/tcp":[{"HostIp":"","HostPort":"80"}]}
vi config.v2.json
# 找到ExposedPorts, 增加以下内容
# "ExposedPorts":{80/tcp":{}}
```

### 4.修改host主机的tomcat server.xml
```shell
vi webapps/server.xml # 修改端口, 把Connector的port改为80
# 最后的配置文件精简如下:
<Server port="8005" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.startup.VersionLoggerListener" />
  <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" />
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />

  <GlobalNamingResources>
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml" />
  </GlobalNamingResources>

  <Service name="Catalina">
    <Connector port="80" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />

    <Engine name="Catalina" defaultHost="emo-madao.top">
      <Realm className="org.apache.catalina.realm.LockOutRealm">
        <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
               resourceName="UserDatabase"/>
      </Realm>

      <Host name="emo-madao.top"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">

        <Context path="" docBase="vuepress" />

        <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%h %l %u %t &quot;%r&quot; %s %b" />

      </Host>
    </Engine>
  </Service>
</Server>
```

### 5.启动docker以及启动tomcat
```shell
systemctl start docker
docker start tomcat
docker ps
# 检查一下看看端口号是否已经改了
CONTAINER ID   IMAGE     COMMAND             CREATED       STATUS         PORTS                NAMES
a488578e56e1   tomcat    "catalina.sh run"   5 weeks ago   Up 2 seconds   0.0.0.0:80->80/tcp   tomcat
```

### 6.随手测试一下能否用
```shell 
curl emo-madao.top
```