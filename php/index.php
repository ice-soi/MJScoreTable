<?php
//======================================================================
// 入力したID,PASSWORDを判定しﾛｸﾞｲﾝ処理を行う
//======================================================================

	//-----------------------------------------------------
	// 参照ﾌｧｲﾙ
	//-----------------------------------------------------
		require_once 'DbAccessor.php';

	//-----------------------------------------------------
	// 定数
	//-----------------------------------------------------
		define("URL","../view/home.html");		// 遷移先のﾘﾝｸ
		define("CONFIG","./config/config.ini");	// 設定ﾌｧｲﾙ
		define("LOGIN_SQL","./sql/LOGIN.sql");	// ﾛｸﾞｲﾝ用SQL

	//-----------------------------------------------------
	// ﾘｸｴｽﾄﾊﾟﾗﾒｰﾀ取得
	//-----------------------------------------------------
		$id   = $_POST['userid'];			// ﾕｰｻﾞID
		$pass = $_POST['password'];        // ﾊﾟｽﾜｰﾄﾞ

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
	// ID,PASSWORD判定処理
	//-----------------------------------------------------
		// ﾊﾟﾗﾒｰﾀ設定
		$param = array($id,$pass);
		// SQLの取得
		$sql = file_get_contents(LOGIN_SQL);
		// ID、ﾊﾟｽﾜｰﾄﾞが存在するかを判定する
		$ret = $dba->Exist($sql,$param);

		// 該当のIDとPASSWORDが存在しない場合
		if(!$ret){
			// ｴﾗｰ応答
			header("HTTP/1.1 503 Service Unavailable");
			// ｴﾗｰを返却
			return FALSE;
		}
	//-----------------------------------------------------
	// ｾｯｼｮﾝの保存
	//-----------------------------------------------------
		// ｾｯｼｮﾝの開始
		session_start();
		// ｾｯｼｮﾝを保存する
		$_SESSION['accountid'] = $id;

	//-----------------------------------------------------
	// ｸﾗｲｱﾝﾄへのﾚｽﾎﾟﾝｽ
	//-----------------------------------------------------
		// JSONの返却
		echo URL;