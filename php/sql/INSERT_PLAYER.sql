INSERT INTO m_player (`PLAYERCODE`, `PLAYERNAME`, `COMMENT`, `ACCOUNTID`, `DELFLG`) SELECT COALESCE( MAX( PLAYERCODE ) + 1,1), ?, ?, ?, '0' FROM m_player