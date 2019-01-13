SELECT TOTAL.PLAYER,
		PLAYER.PLAYERNAME,
        COALESCE(TOTAL.TOTAL,0) AS TOTAL
  FROM (
       			SELECT PLAYERCODE,
       					PLAYERNAME
                  FROM m_player
                 WHERE ACCOUNTID = ?
                   AND DELFLG = '0'
           ) PLAYER
 INNER JOIN (
					SELECT `PLAYER`,
					        sum(CAST(playerrecord AS SIGNED)) AS `TOTAL`
  					  FROM `t_history`
 				  	 WHERE `ACCOUNTID` = ? AND
 	    				    `HISTORYDATE` = ? AND
 	    				    `HISTORYTIME` = ?
					 GROUP BY `PLAYER`
             ) AS TOTAL
   ON PLAYER.PLAYERCODE = TOTAL.PLAYER
  ORDER BY PLAYER.PLAYERCODE