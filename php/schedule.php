<?php
//======================================================================
// 開催予定の作成,更新,削除を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("URL","../view/schedule.html");		            // 遷移先のﾘﾝｸ
		define("CONFIG","./config/config.ini");     	        // 設定ﾌｧｲﾙ
		define("INSERT_SQL","./sql/INSERT_SCHEDULE.sql");	    // ｽｹｼﾞｭｰﾙ作成用SQL
		define("DELETE_SQL","./sql/DELETE_SCHEDULE.sql");       // ｽｹｼﾞｭｰﾙ削除用SQL
		define("EXISTS_SQL","./sql/EXISTS_SCHEDULE.sql");	    // ｽｹｼﾞｭｰﾙ存在確認用SQL
		define("INSERT","0");         							// ｽｹｼﾞｭｰﾙ作成ｽﾃｰﾀｽ
		define("DELETE","1");         							// ｽｹｼﾞｭｰﾙ削除ｽﾃｰﾀｽ
		define("UPDATE","2");         							// ｽｹｼﾞｭｰﾙ作成ｽﾃｰﾀｽ

	//-----------------------------------------------------
	// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀ取得
	//-----------------------------------------------------
		$date       = $_POST['date'];     		// 予定日
		$time       = $_POST['time'];      	// 予定時間
		$beforedate = $_POST['beforedate'];    // 予定日
		$beforetime = $_POST['beforetime'];    // 予定時間
		$title      = $_POST['title'];      	// ﾀｲﾄﾙ
		$remarks    = $_POST['remarks'];      	// 内容
		$status     = $_POST['status'];      	// 作成・削除ｽﾃｰﾀｽ

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
	// ｽｹｼﾞｭｰﾙ作成,削除処理
	//-----------------------------------------------------

		// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀのｽﾃｰﾀｽを判定して処理を分ける
		switch($status){
			case INSERT:
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($date,$time,$accountid);
				// SQLの取得
				$sql = file_get_contents(EXISTS_SQL);

				$ret = $dba->Exist($sql,$param);

				if($ret){
					// ｴﾗｰ応答
					header("HTTP/1.1 503 Service Unavailable");
					// ｴﾗｰを返却
					return FALSE;
				}
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($date,$time,$title,$remarks,$accountid);
				// SQLの取得
				$sql = file_get_contents(INSERT_SQL);
				// 実行処理
				$ret = $dba->Execute($sql,$param);
				break;
			case DELETE:
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($date,$time,$accountid);
				// SQLの取得
				$sql = file_get_contents(DELETE_SQL);
				// 実行処理
				$ret = $dba->Execute($sql,$param);
				break;
			case UPDATE:
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($beforedate,$beforetime,$accountid);
				// SQLの取得
				$sql = file_get_contents(DELETE_SQL);
				// 実行処理
				$ret = $dba->Execute($sql,$param);

				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($date,$time,$title,$remarks,$accountid);
				// SQLの取得
				$sql = file_get_contents(INSERT_SQL);
				// 実行処理
				$ret = $dba->Execute($sql,$param);
				break;
			default:
		}
		// 該当のIDとPASSWORDが存在しない場合
		if(!$ret){
			// ｴﾗｰ応答
			header("HTTP/1.1 503 Service Unavailable");
			// ｴﾗｰを返却
			return FALSE;
		}
	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------
		// JSONの返却
		echo URL;
