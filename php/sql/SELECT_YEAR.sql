SELECT YEAR
   FROM (
                SELECT SUBSTRING(`HISTORYDATE`FROM 1 FOR 4) AS YEAR
                  FROM `t_history`
                 WHERE `ACCOUNTID` = ?
                GROUP BY `HISTORYDATE`
             ) YEAR
  GROUP BY
       YEAR.YEAR