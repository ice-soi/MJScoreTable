SELECT
    COALESCE(`history`.`HISTORYDATE`,DATE_FORMAT(now(),'%Y%m%d') ) AS `HISTORYDATE`,
    COALESCE(`history`.`HISTORYTIME`,DATE_FORMAT(now(),'%k%i') ) AS `HISTORYTIME`,
    `history`.`ACCOUNTID`,
    COALESCE(`history`.`TIMES`,'1') AS `TIMES`,
    lpad(`player`.`PLAYERCODE`, 8, '0') AS `PLAYER`,
    `player`.`PLAYERNAME`,
    COALESCE(`history`.`PLAYERRECORD`,'') AS `PLAYERRECORD`,
    COALESCE(`history`.`TITLE`,'') AS `TITLE`
FROM (
    SELECT
        `PLAYERCODE`,
        `PLAYERNAME`
    FROM
        `m_player`
    WHERE
        `ACCOUNTID` = ? AND
        `DELFLG` = '0'
   ) player
LEFT JOIN
    ( SELECT
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
ON
    `player`.`PLAYERCODE` = `history`.`PLAYER`
ORDER BY PLAYER,TIMES
