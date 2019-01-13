<?php
//======================================================================
// 成績一覧の取得を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';
		require_once 'Utility.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("URL","../view/input.html");		            		// 遷移先のﾘﾝｸ
		define("CONFIG","./config/config.ini");     	 		    // 設定ﾌｧｲﾙ
		define("SELECT_PLAYER_SQL","./sql/SELECT_PLAYER.sql");	    // 成績入力用SQL
		define("SELECT_HISTORY_SQL","./sql/SELECT_HISTORY.sql");	// 履歴取得SQL

	//-----------------------------------------------------
	// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀ取得
	//-----------------------------------------------------
		$date       = $_POST['date'];     		// 予定日
		$time       = $_POST['time'];      	// 予定時間

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
	// 成績取得処理
	//-----------------------------------------------------
		$player = array();
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid);
		// SQLの取得
		$sql = file_get_contents(SELECT_PLAYER_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);
		// 返却行
		foreach($ret as $row){
			$player[]=array(
					'player'=>$row['PLAYERCODE'],
					'name'=>$row['PLAYERNAME']
			);
		}


		$data = array();
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid,$date,$time);
		// SQLの取得
		$sql = file_get_contents(SELECT_HISTORY_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);
		// 返却行
		foreach($ret as $row){
			$data[]=array(
					'times'=>$row['TIMES'],
					'code'=>$row['PLAYER'],
					'record'=>$row['PLAYERRECORD']
			);
		}
	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------

		$result = array();
		$result[] = array(
				'data'=>$data,
				'player'=>$player
		);
		// JSONの返却
		echo json_encode($result);
