---
title: Idea设置Live Template
lang: zh-CN
description: setting live template in idea
date: '2026-8-9 15:37:00'
sidebar: 'auto'
meta:
 - name: description
   content: Idea设置Live Template
 - name: keywords
   content: Live Template
categories:
 - IDE
tags:
 - Live Template
---

## 1. File and Code Templates（类级别模板）
### 配置步骤
1. Settings → Editor → File and Code Templates → Includes
2. 修改 File Header 为
   ```java
   /**
   * ${NAME}.
   *
   * @author Jack Lo
   * @version 1.0
   * @date ${DATE}
   */
   ```
这样每次创建新 Java 文件时会自动插入该注释头。

## 2. 自定义 Live Template
### 配置步骤
1. 打开Idea，点击菜单栏 Settings → Editor → Live Templates
2. 点击右侧 + → Group，创建一个分组（如 MyJavadoc）
3. 选中该分组，点击 + → Live Template
4. 配置如下：

   Abbreviation（缩写）: *
   
   Template text:
   ```java
   *
    * $DESCRIPTION$
    *$PARAM$
    * @return $RETURN$
    * @date $DATE$
    */
   ```
5. 点击 Edit variables，配置各变量：
   | Name | Expression | Skip if defined |
   | --- | --- | --- |
   | DESCRIPTION | - | false |
   | PARAM | 见下方 `PARAM` 表达式 | true |
   | RETURN | `methodReturnType()` | true |
   | DATE | `date("yyyy/M/d HH:mm")` | true |

   **PARAM 表达式：**
   ```groovy
   groovyScript(
       "def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList(); def result=''; for(i=0;i<params.size();i++){if(params[i]){result+=' * @param ' +params[i]+'\\n'}}; if(result.isEmpty()){return ''}else{return '\\n'+result.substring(0,result.length()-1)}",
       methodParameters()
   )
   ```
6. Define applicable contexts：选择 *Java*

使用方式：
在方法上方输入 /* 然后按 Tab（或你设置的触发快捷键），即可自动生成。

