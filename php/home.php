<?php
//======================================================================
// 結果一覧の表示を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';
		require_once 'Utility.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("CONFIG","./config/config.ini");     				// 設定ﾌｧｲﾙ
		define("SELECT_SQL","./sql/SELECT_RANK_FIVE.sql");    		// 集計取得用SQL
		define("SELECT_SCH_SQL","./sql/SELECT_GET_SCHEDULE.sql");   // 集計取得用SQL

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
	// 参照情報取得処理
	//-----------------------------------------------------

		// 直近の予定日を取得する
		$param = array();
		// SQLの取得
		$sql = file_get_contents(SELECT_SCH_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);

		$sch = array();
		foreach($ret as $row){
			$sch[] = array(
							'date'=>Utility::dateFormatJap($row['SCHEDULEDATE']),
							'time'=>Utility::timeFormatJap($row['SCHEDULETIME'])
					);
			break;
		}

		// ﾗﾝｷﾝｸﾞを取得
		// SQLの取得
		$sql = file_get_contents(SELECT_SQL);

		$param = array();
		// ﾊﾟﾗﾒｰﾀ設定
		//$param = array($accountid,$accountid,$accountid,$accountid);
		$param = array($accountid,$accountid);
		// 実行処理
		$ret = $dba->Select($sql,$param);

		$rank = array();
		$top = null;
		$sub = '-';
		$count = 1;
		// 返却行
		foreach($ret as $row){
			if($count == 1 && $top == null){
				$top = $row['SCORE'];
			}
			if($count != 1){
				$sub = $top - $row['SCORE'];
			}
			$rank[]=array(
					'name'=>$row['PLAYERNAME'],
					'score'=>$row['SCORE'],
					'rank'=>$count,
					'sub'=>$sub
			);
			$count++;
		}

		// 取得結果をﾚｽﾎﾟﾝｽに設定
		$result = array();
		$result[]=array(
				'data'=>$rank,
				'sch'=>$sch
		);

	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------
		// JSONの返却
		echo json_encode($result);
