<?php
//======================================================================
// ﾌﾟﾚｲﾔｰの作成,更新,削除を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("URL","../view/management.html");		        // 遷移先のﾘﾝｸ
		define("CONFIG","./config/config.ini");     	        // 設定ﾌｧｲﾙ
		define("INSERT_SQL","./sql/INSERT_PLAYER.sql");	        // ﾌﾟﾚｲﾔｰ作成用SQL
		define("DELETE_SQL","./sql/DELETE_PLAYER.sql");         // ﾌﾟﾚｲﾔｰ削除用SQL
		define("UPDATE_SQL","./sql/UPDATE_PLAYER.sql");         // ﾌﾟﾚｲﾔｰ更新用SQL
		define("INSERT","0");         							// ﾌﾟﾚｲﾔｰ作成ｽﾃｰﾀｽ
		define("DELETE","1");         							// ﾌﾟﾚｲﾔｰ削除ｽﾃｰﾀｽ
		define("UPDATE","2");         							// ﾌﾟﾚｲﾔｰ更新ｽﾃｰﾀｽ

	//-----------------------------------------------------
	// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀ取得
	//-----------------------------------------------------
		$playerid   = $_POST['playerid'];		// ﾌﾟﾚｲﾔｰID
		$name       = $_POST['name'];     		// ﾌﾟﾚｲﾔｰ名
		$comment    = $_POST['comment'];      	// ｺﾒﾝﾄ
		$status     = $_POST['status'];      	// 作成・削除ｽﾃｰﾀｽ

	//-----------------------------------------------------
	// ｾｯｼｮﾝﾃﾞｰﾀ取得
	//-----------------------------------------------------
		session_start();
		$accountid   = $_SESSION['accountid'];		// ｱｶｳﾝﾄID セッションから取得する

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
	// ﾌﾟﾚｲﾔｰ作成,削除処理
	//-----------------------------------------------------

		// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀのｽﾃｰﾀｽを判定して処理を分ける
		switch($status){
			case INSERT:
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($name,$comment,$accountid);
				// SQLの取得
				$sql = file_get_contents(INSERT_SQL);
				break;
			case DELETE:
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($playerid);
				// SQLの取得
				$sql = file_get_contents(DELETE_SQL);
				break;
			case UPDATE:
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($name,$comment,$playerid);
				// SQLの取得
				$sql = file_get_contents(UPDATE_SQL);
				break;
			default:
		}
		// 実行処理
		$ret = $dba->Execute($sql,$param);
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