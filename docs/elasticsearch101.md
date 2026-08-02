---
title: Docker配置Elasticsearch
lang: zh-CN
description: Elasticsearch note
date: '2020-10-31 00:00:00'
sidebar: 'auto'
meta:
 - name: description
   content: Docker配置Elasticsearch
 - name: keywords
   content: Docker Elasticsearch
categories:
 - 部署运维
tags:
 - Docker
 - Elasticsearch
---

> 在SpringBoot的后端开发练习中要用到搜索引擎Elasticsearch，由于之前的项目都在Docker中配置镜像，这次也不例外

## 1.Docker中安装Elasticsearch
### 1.1 拉取镜像
```shell
docker pull elasticsearch
```

### 1.2 创建容器并运行
```shell
docker run -d docker.io/elasticsearch --name myes -p 9200:9200 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms256m -Xmx256m" --restart=always
```

### 1.3 修改elasticsearch.yml配置文件
```shell
docker exec -it myes /bin/bash
vi config/elasticsearch.yml
```
添加以下两行对跨域访问的支持：
```shell
http.cors.enabled: true
http.cors.allow-origin: "*"
```

### 1.4 重启容器
```shell
docker restart myes
```

### 1.5 浏览器访问虚拟机9200端口地址有json字符串返回成功即可
```json
{
  "name" : "518c0f242750",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "jJci8N6gSJe4lqzgiNVNTw",
  "version" : {
    "number" : "7.8.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "757314695644ea9a1dc2fecd26d1a43856725e65",
    "build_date" : "2020-06-14T19:35:50.234439Z",
    "build_snapshot" : false,
    "lucene_version" : "8.5.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

### 1.6 添加ik中文分词器插件
在GitHub中下载不高于Elasticsearch版本的分词器： [elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik/releases)  
解压后将文件传输到虚拟机，以我为例，我下载的是7.8.0版本，并将解压后的文件夹上传至虚拟机根目录，确保已经启动了elasticseach容器，执行以下指令将插件复制到容器内部：
```shell
docker cp ./elasticsearch-analysis-ik-7.8.0/ myes:/usr/share/elasticsearch/plugins
```
然后重启elasticsearch容器即可


## 2.SpringBoot添加Elasticsearch依赖并配置
### 2.1 pom.xml
```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-elasticsearch</artifactId>
    <version>4.0.5.RELEASE</version>
</dependency>
```

### 2.2 配置Bean
高版本的Elasticsearch已经不需要在application.yml中配置，原先的spring.data.elasticsearch.cluster-nodes已经废弃，以前需要用到9300端口，现在也不需要了，用回9200即可，但需要一个配置类支持：
```java
@Bean
public RestHighLevelClient elasticsearchClient() {
    ClientConfiguration clientConfiguration = ClientConfiguration.builder().connectedTo("192.168.0.118:9200").build();

    return RestClients.create(clientConfiguration).rest();
}
```

### 2.3 ElasticsearchDao
之后的增删改查操作沿用Spring Data Jpa的即可：
```java
public interface ElasticsearchDao extends ElasticsearchRepository<Object, String> {
}
```