SELECT lpad(`PLAYERCODE`, 8, '0') AS `PLAYERCODE`,
        PLAYERNAME,
        COMMENT,
        ACCOUNTID,
        DELFLG
  FROM `m_player`
 WHERE ACCOUNTID = ?
   AND DELFLG = '0'