SELECT PLAYER.PLAYERNAME,
            COALESCE(SCORE.SCORE,'0') AS SCORE
    FROM  (
                   SELECT
                        `PLAYERCODE`,
                        `PLAYERNAME`
                    FROM
                        `m_player`
                    WHERE
                        `ACCOUNTID` = 'KOKUBUNCUP' AND
                        `DELFLG` = '0'
               ) PLAYER
      INNER JOIN (
                    SELECT PLAYER,
                                SUM(CAST(playerrecord AS SIGNED)) AS SCORE
                      FROM `t_history`
                    WHERE `ACCOUNTID` = 'KOKUBUNCUP'
                         AND DATE_FORMAT(`HISTORYDATE`,'%Y-%m-%d') >= DATE_FORMAT(now(),'%Y-%01-%01')
                         AND DATE_FORMAT(`HISTORYDATE`,'%Y-%m-%d') <= DATE_FORMAT(now(),'%Y-%12-%31')
                     GROUP BY PLAYER
                  ) SCORE
    ON PLAYER.PLAYERCODE = SCORE.PLAYER
ORDER BY SCORE.SCORE + 0 DESC
LIMIT 5