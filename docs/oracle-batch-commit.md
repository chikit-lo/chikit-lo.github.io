---
title: Oracle批量事务更新大量数据
lang: zh-CN
description: Oracle batch update commit
date: '2020-10-21 00:00:00'
sidebar: 'auto'
meta:
 - name: description
   content: Oracle批量事务更新大量数据
 - name: keywords
   content: Oracle
categories:
 - 数据库
tags:
 - Oracle
---
> 在工作中曾经遇到过需要更新生产环境中一张千万级别的表数据，直接全表用update效率太低了，写了一个脚本来实现分批数据更新，更新了千万级别数据大概需要10分钟

```sql
--打开日志信息输出到控制台
SET SERVEROUTPUT ON;
DECLARE
    --声明数组，存放主键id
    TYPE t_id IS TABLE OF CVSDB.BVS_UNITY_MSG.ID%TYPE;
    v_id t_id;

    --取数游标
    CURSOR cur IS
    SELECT ID FROM CVSDB.BVS_UNITY_MSG WHERE MSG_TYPE = '3' AND SEND_STATUS = '0';

    --更新数量
    v_cnt INTEGER := 0;

BEGIN
    OPEN cur;

    --循环取数
    LOOP
    EXIT WHEN cur%NOTFOUND;

    --每次批量检索结果：10000条记录
    FETCH cur BULK COLLET INTO v_id LIMIT 10000;

    --批量发送更新语句
    FORALL i IN 1...v_id.COUNT
    UPDATE CVSDB.BVS_UNITY_MSG SET SEND_STATUS = '1', UPDATOR = 'SCRIPT_BATCH_UPD', UPDATE_TIME = CURRENT_TIMESTAMP WHERE ID = v_id(i);
    COMMIT;

    v_cnt := v_cnt + v_id.COUNT;

    END LOOP;

    CLOSE cur;

    DBMS_OUTPUT.PUT_LINE('UPDATE DATA SUCCESSFULLY: '||v_cnt);

    --异常回滚
    EXCEPTION
    WHEN OTHER THEN
    DBMS_OUTPUT.PUT_LINE('UPDATE DATA ERROR, ROLLBACK...');
    ROLLBACK;
END;
/
```