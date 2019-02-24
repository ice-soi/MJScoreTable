<?php
//======================================================================
// ﾌﾟﾚｲﾔｰの一覧の作成を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';
		require_once 'Utility.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("URL","../view/schedule.html");		        // 遷移先のﾘﾝｸ
		define("CONFIG","./config/config.ini");     	    // 設定ﾌｧｲﾙ
		define("SELECT_SQL","./sql/SELECT_SCHEDULE.sql");	// ｽｹｼﾞｭｰﾙ取得用SQL

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
	// ﾌﾟﾚｲﾔｰ取得処理
	//-----------------------------------------------------
		$data = array();
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid);
		// SQLの取得
		$sql = file_get_contents(SELECT_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);
		// 返却行
		foreach($ret as $row){
			$data[]=array(
					'date'=>Utility::dateFormat($row['SCHEDULEDATE']),
					'time'=>Utility::timeFormat($row['SCHEDULETIME']),
					'title'=>$row['TITLE'],
					'remarks'=>$row['REMARKS'],
					'url'=>URL
			);
		}
	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------
		// JSONの返却
		echo json_encode($data);
