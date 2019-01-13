<?php
//======================================================================
// 集計の表示を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("CONFIG","./config/config.ini");     			// 設定ﾌｧｲﾙ
		define("SELECT_SQL","./sql/SELECT_AGGREGATE.sql");    	// 集計取得用SQL

	//-----------------------------------------------------
	// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀ取得
	//-----------------------------------------------------
		$year       = $_POST['year'];     		    // 年

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
	// 集計取得処理
	//-----------------------------------------------------

		$stYear = $year.'0101';
		$edYear = $year.'1231';

		$data = array();
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($accountid,$accountid,$accountid);
		// SQLの取得
		$sql = file_get_contents(SELECT_SQL);
		// 実行処理
		$ret = $dba->Select($sql,$param);

		$temp = array();
		// 返却行
		foreach($ret as $row){
			$data[]=array(
					'code'=>$row['PLAYER'],
					'name'=>$row['PLAYERNAME'],
					'first'=>$row['RANKFIRST'],
					'second'=>$row['RANKSECOND'],
					'third'=>$row['RANKTHIRD'],
					'fourth'=>$row['RANKFOURTH'],
					'score'=>$row['SCORE'],
					'total'=>$row['TOTAL'],
					'topper'=>number_format($row['TOPPER'],2),
					'avarage'=>number_format($row['AVA'],1)
			);
		}

	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------
		// JSONの返却
		echo json_encode($data);
