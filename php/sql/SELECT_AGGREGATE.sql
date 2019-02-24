SELECT RANK.PLAYER,
			PLAYER.PLAYERNAME,
            COALESCE(RANK.RANKFIRST,'0') AS RANKFIRST,
            COALESCE(RANK.RANKSECOND,'0') AS RANKSECOND,
            COALESCE(RANK.RANKTHIRD,'0') AS RANKTHIRD,
            COALESCE(RANK.RANKFOURTH,'0') AS RANKFOURTH,
            COALESCE(SCORE.SCORE,'0') AS SCORE,
            COALESCE(SCORE.TOTAL,'0') AS TOTAL,
            COALESCE((1.0 * RANK.RANKFIRST / SCORE.TOTAL )  * 100,0) AS TOPPER,
            COALESCE((1.0 * SCORE.SCORE / SCORE.TOTAL ),0) AS AVA
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
					SELECT t4.`PLAYER`,
								MAX(CASE
            								WHEN t4.`RANK` = 1 THEN t4.CNT
                							ELSE 0
            					END) AS RANKFIRST,
                                MAX(CASE
                                    WHEN t4.`RANK` = 2 THEN t4.CNT
                                    ELSE 0
                                END) AS RANKSECOND,
                                MAX(CASE
                                    WHEN t4.`RANK` = 3 THEN t4.CNT
                                    ELSE 0
                                END) AS RANKTHIRD,
                                MAX(CASE
                                    WHEN t4.`RANK` = 4 THEN t4.CNT
                                    ELSE 0
                                END) AS RANKFOURTH
  						FROM (
            						SELECT
                    							t3.`PLAYER`,
                    							t3.`RANK`,
                    							COUNT(t3.rank) as CNT
                					  FROM
                    							(SELECT
                        										t1.`HISTORYDATE`,
                                                                t1.`HISTORYTIME`,
                                                                t1.`ACCOUNTID`,
                                                                t1.`TIMES`,
                                                                t1.`PLAYER`,
                                                                t1.`PLAYERRECORD`,
                                                                SUM(CAST(t1.`PLAYERRECORD` AS SIGNED) <= CAST(t2.`PLAYERRECORD` AS SIGNED)) as RANK
                    								FROM
                        										`t_history` t1
                                                    INNER JOIN (SELECT *
                                                                    FROM `t_history`
                                                                   WHERE DATE_FORMAT(`HISTORYDATE`,'%Y-%m-%d') >= DATE_FORMAT(?,'%Y-%01-%01')
                                                                     AND DATE_FORMAT(`HISTORYDATE`,'%Y-%m-%d') <= DATE_FORMAT(?,'%Y-%12-%31')
                                                                 ) t2
                                                             ON t1.`HISTORYDATE` = t2.`HISTORYDATE` AND
                                                 												 t1.`HISTORYTIME` = t2.`HISTORYTIME` AND
                                                 												 t1.`ACCOUNTID` = t2.`ACCOUNTID` AND
                                                                                                 t1.`TIMES` = t2.`TIMES`
                    								WHERE
                        									t1.`ACCOUNTID` = ?
                    								GROUP BY
                                                            t1.`HISTORYDATE`,
                                                            t1.`HISTORYTIME`,
                                                            t1.`ACCOUNTID`,
                                                            t1.`TIMES`,
                                                            t1.`PLAYER`
                    						   ) as t3
                					GROUP BY
                                            t3.`PLAYER`,
                                            t3.`RANK`
                	) t4
   			GROUP BY
   					t4.`PLAYER`
         ) RANK
     ON PLAYER.PLAYERCODE = RANK.PLAYER
 LEFT JOIN (
                    SELECT PLAYER,
                                SUM(CAST(playerrecord AS SIGNED)) AS SCORE,
                                COUNT(PLAYER) as TOTAL
                      FROM `t_history`
                    WHERE `ACCOUNTID` = ?
                      AND DATE_FORMAT(`HISTORYDATE`,'%Y-%m-%d') >= DATE_FORMAT(?,'%Y-%01-%01')
                      AND DATE_FORMAT(`HISTORYDATE`,'%Y-%m-%d') <= DATE_FORMAT(?,'%Y-%12-%31')
                     GROUP BY PLAYER
                  ) SCORE
    ON PLAYER.PLAYERCODE = SCORE.PLAYER
ORDER BY SCORE.SCORE + 0 DESC ,SCORE.TOTAL + 0 DESC