<?php
//======================================================================
// 成績の作成,更新,削除を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
	require_once 'DbAccessor.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("URL","../view/input.html");		            // 遷移先のﾘﾝｸ
		define("CONFIG","./config/config.ini");     	    // 設定ﾌｧｲﾙ
		define("INSERT_SQL","./sql/INSERT_RECORD.sql");	    // 成績入力用SQL
		define("DELETE_SQL","./sql/DELETE_RECORD.sql");     // 成績削除用SQL
		define("EXISTS_SQL","./sql/SELECT_RECORD.sql");	    // 成績存在確認用SQL
		define("INSERT","0");         						// 成績作成ｽﾃｰﾀｽ
		define("DELETE","1");         						// 成績削除ｽﾃｰﾀｽ
		define("UPDATE","2");         						// 成績更新ｽﾃｰﾀｽ

	//-----------------------------------------------------
	// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀ取得
	//-----------------------------------------------------
		$date       = $_POST['date'];     		// 予定日
		$time       = $_POST['time'];      	// 予定時間
		$beforedate = $_POST['beforedate'];    // 予定日
		$beforetime = $_POST['beforetime'];    // 予定時間
		$title      = $_POST['title'];      	// ﾀｲﾄﾙ
		$records    = $_POST['records'];       // 成績
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
	// 成績作成,削除処理
	//-----------------------------------------------------

		// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀのｽﾃｰﾀｽを判定して処理を分ける
		switch($status){
			case INSERT:
				// SQLの取得
				$sql = file_get_contents(EXISTS_SQL);
				// ﾊﾟﾗﾒｰﾀ設定
				$param = array($date,$time,$accountid);
				// ﾚｺｰﾄﾞが存在しているかを判定
				$ret = $dba->Exist($sql,$param);

				if($ret){
					// ｴﾗｰ応答
					header("HTTP/1.1 503 Service Unavailable");
					// ｴﾗｰを返却
					return FALSE;
				}

				$times = 0;
				$player = '';
				// SQLの取得
				$sql = file_get_contents(INSERT_SQL);
				foreach($records as $rec){
					foreach($rec as $val){
						if($times == 0){
							$player = $val;
							$times++;
							continue;
						}
						if($val != ''){
							// ﾊﾟﾗﾒｰﾀ設定
							$param = array($date,$time,$accountid,$times,$title,$player,$val);
							$ret = $dba->Execute($sql,$param);
						}
						$times++;
						if ($times >= count($rec)){
							$player = '';
							$times  = 0;
						}
					}
				}
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
				$param = array($date,$time,$accountid);
				// SQLの取得
				$sql = file_get_contents(DELETE_SQL);
				// 実行処理
				$ret = $dba->Execute($sql,$param);

				$times = 0;
				$player = '';
				// SQLの取得
				$sql = file_get_contents(INSERT_SQL);
				foreach($records as $rec){
					foreach($rec as $val){
						if($times == 0){
							$player = $val;
							$times++;
							continue;
						}
						if($val != ''){
							// ﾊﾟﾗﾒｰﾀ設定
							$param = array($date,$time,$accountid,$times,$title,$player,$val);
							$ret = $dba->Execute($sql,$param);
						}
						$times++;
						if ($times >= count($rec)){
							$player = '';
							$times  = 0;
						}
					}
				}
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