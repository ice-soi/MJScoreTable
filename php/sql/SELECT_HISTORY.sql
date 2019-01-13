SELECT
    COALESCE(`history`.`HISTORYDATE`,DATE_FORMAT(now(),'%Y%m%d') ) AS `HISTORYDATE`,
    COALESCE(`history`.`HISTORYTIME`,DATE_FORMAT(now(),'%k%i') ) AS `HISTORYTIME`,
    `history`.`ACCOUNTID`,
    COALESCE(`history`.`TIMES`,'1') AS `TIMES`,
    lpad(`history`.`PLAYER`, 8, '0') AS `PLAYER`,
    COALESCE(`history`.`PLAYERRECORD`,'-') AS `PLAYERRECORD`,
    COALESCE(`history`.`TITLE`,'') AS `TITLE`
FROM (
     SELECT
         `HISTORYDATE`,
         `HISTORYTIME`,
         `ACCOUNTID`,
         `TIMES`,
         `PLAYER`,
         `PLAYERRECORD`,
         `TITLE`
     FROM
         `t_history`
     WHERE
         `ACCOUNTID` = ? AND
         `HISTORYDATE` = ? AND
         `HISTORYTIME` = ?
   ) history
ORDER BY TIMES IS NULL ASC, TIMES + 0 ASC,PLAYER ASC