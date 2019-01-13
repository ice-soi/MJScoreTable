<?php
//======================================================================
// 履歴の表示を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';
		require_once 'Utility.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("URL","../view/schedule.html");		        			// 遷移先のﾘﾝｸ
		define("CONFIG","./config/config.ini");     					// 設定ﾌｧｲﾙ
		define("GET_DATE_SQL","./sql/SELECT_DATE.sql");					// 日付取得用SQL
		define("GET_TOTAL_SQL","./sql/SELECT_TOTAL.sql");				// 合計取得用SQL
		define("SELECT_SQL","./sql/SELECT_HISTORY.sql");    			// 履歴取得用SQL
		define("SELECT_PLAYER_SQL","./sql/SELECT_HISTORY_PLAYER.sql");  // 履歴名称取得用SQL

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
	// 履歴取得処理
	//-----------------------------------------------------

		// ﾘｸｴｽﾄに日付がない場合直近の日付を取得する
		if($date == '' ){
			// ﾊﾟﾗﾒｰﾀ設定
			$param = array($accountid);
			// SQLの取得
			$sql = file_get_contents(GET_DATE_SQL);
			// 実行処理
			$ret = $dba->Select($sql,$param);

			foreach($ret as $row){
				$date = $row['HISTORYDATE'];
				$time = $row['HISTORYTIME'];
			}
		}

		$total = array();
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid,$accountid,$date,$time);
		// SQLの取得
		$sql = file_get_contents(GET_TOTAL_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);

		foreach($ret as $row){
			$total[]=array(
					'player'=>$row['PLAYER'],
					'name'=>$row['PLAYERNAME'],
					'total'=>$row['TOTAL']
			);
		}

		$player = array();
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid,$date,$time,$accountid);
		// SQLの取得
		$sql = file_get_contents(SELECT_PLAYER_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);

		foreach($ret as $row){
			$player[]=array(
					'player'=>$row['PLAYER'],
					'name'=>$row['PLAYERNAME']
			);
		}

		$data = array();
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid,$date,$time);
		// SQLの取得
		$sql = file_get_contents(SELECT_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);

		$player = '';
		$count = 0;
		foreach ($ret as $row){
			$data[]=array(
					'date'=>Utility::dateFormat($row['HISTORYDATE']),
					'time'=>Utility::timeFormat($row['HISTORYTIME']),
					'times'=>$row['TIMES'],
					'code'=>$row['PLAYER'],
					'record'=>$row['PLAYERRECORD'],
					'title'=>$row['TITLE'],
					'count'=>$count
			);
		}


		$result = array();
		$result[] = array(
				'total'=>$total,
				'data'=>$data,
				'player'=>$player
		);

	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------
		// JSONの返却
		echo json_encode($result);
