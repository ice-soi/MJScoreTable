SELECT PLAYER.PLAYERNAME,
            COALESCE(SCORE.SCORE,'0') AS SCORE
    FROM  (
                   SELECT
                        `PLAYERCODE`,
                        `PLAYERNAME`
                    FROM
                        `m_player`
                    WHERE
                        `ACCOUNTID` = ? AND
                        `DELFLG` = '0'
               ) PLAYER
      LEFT JOIN (
                    SELECT PLAYER,
                                SUM(CAST(playerrecord AS SIGNED)) AS SCORE
                      FROM `t_history`
                    WHERE `ACCOUNTID` = ?
                     GROUP BY PLAYER
                  ) SCORE
    ON PLAYER.PLAYERCODE = SCORE.PLAYER
ORDER BY SCORE.SCORE + 0 DESC
LIMIT 5
