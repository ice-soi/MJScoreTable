<?php
//======================================================================
// 年月日ﾘｽﾄの取得を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';
		require_once 'Utility.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("CONFIG","./config/config.ini");     			// 設定ﾌｧｲﾙ
		define("SELECT_SQL","./sql/SELECT_YAER_DATE.sql");      // 年取得用SQL

	//-----------------------------------------------------
	// ｾｯｼｮﾝﾃﾞｰﾀ取得
	//-----------------------------------------------------
		session_start();
		$accountid   = $_SESSION['accountid'];		// ｱｶｳﾝﾄID

	//-----------------------------------------------------
	// DB接続
	//-----------------------------------------------------
		// 設定ﾌｧｲﾙの取得
		$ini = parse_ini_file(CONFIG);
		$dba = new DbAccessor(array(
				'dsn' =>$ini['dsn'],
				'user' =>$ini['user'],
				'password' =>$ini['password']
		));

	//-----------------------------------------------------
	// 年月日取得処理
	//-----------------------------------------------------

		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid);
		// SQLの取得
		$sql = file_get_contents(SELECT_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);

		$tmp = '';
		$year = array();
		$date = array();
		// 返却行
		foreach($ret as $row){
			if($tmp != $row['YEAR']){
				$tmp = $row['YEAR'];
				$year[] = array('year'=>$row['YEAR']);
			}
			$date[] = array(
					   'year'=>$row['YEAR'],
					   'date'=>Utility::dateFormat($row['HISTORYDATE']),
					   'time'=>Utility::timeFormat($row['HISTORYTIME'])
			);
		}

		$result = array();
		$result[] = array(
				'yearlist'=>$year,
				'datelist'=>$date
		);

	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------
		// JSONの返却
		echo json_encode($result);
