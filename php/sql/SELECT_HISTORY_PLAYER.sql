SELECT HISTORY.PLAYER,
        PLAYER.PLAYERNAME
  FROM  (
           SELECT
			     `HISTORYDATE`,
			     `HISTORYTIME`,
			     `PLAYER`
			 FROM
			     `t_history`
			 WHERE
			     `ACCOUNTID` = ? AND
			     `HISTORYDATE` = ? AND
			     `HISTORYTIME` = ?
			 GROUP BY
			     `HISTORYDATE`,
			     `HISTORYTIME`,
			     `PLAYER`
         ) HISTORY
  LEFT JOIN (
           SELECT
                `PLAYERCODE`,
                `PLAYERNAME`
            FROM
                `m_player`
            WHERE
                `ACCOUNTID` = ? AND
                `DELFLG` = '0'
         ) PLAYER
     ON HISTORY.`PLAYER` = PLAYER.`PLAYERCODE`
  ORDER BY HISTORY.`PLAYER`