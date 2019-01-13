<?php
//======================================================================
// name    : DbAccessor
// remarks : DBｱｸｾｽｸﾗｽ
//======================================================================
class DbAccessor {

	//-----------------------------------------------------
	// ﾒﾝﾊﾞ変数
	//-----------------------------------------------------
		protected $dsn;		// DSN
		protected $user;		// ﾕｰｻﾞｰ
		protected $password;	// ﾊﾟｽﾜｰﾄﾞ
	//-----------------------------------------------------
	// ｺﾝｽﾄﾗｸﾀ
	//-----------------------------------------------------
		//-------------------------------------------------
		// name  : __construct
		// param : $config
		//-------------------------------------------------
		public function __construct($config){
			$this->setDsn($config['dsn']);
			$this->setUser($config['user']);
			$this->setPassword($config['password']);
		}
	//-----------------------------------------------------
	// ｹﾞｯﾀｰ ｾｯﾀｰ
	//-----------------------------------------------------
		//-------------------------------------------------
		// DSNｾｯﾀｰ
		//-------------------------------------------------
		public function setDsn($dsn) {
			$this->dsn = $dsn;
			return $this;
		}
		//-------------------------------------------------
		// DSNｹﾞｯﾀｰ
		//-------------------------------------------------
		public function getDsn() {
			return $this->dsn;
		}
		//-------------------------------------------------
		// USERｾｯﾀｰ
		//-------------------------------------------------
		public function setUser($user) {
			$this->user = $user;
			return $this;
		}
		//-------------------------------------------------
		// USERｹﾞｯﾀｰ
		//-------------------------------------------------
		public function getUser() {
			return $this->user;
		}
		//-------------------------------------------------
		// PASSWORDｾｯﾀｰ
		//-------------------------------------------------
		public function setPassword($password) {
			$this->password = $password;
			return $this;
		}
		//-------------------------------------------------
		// PASSWORDｹﾞｯﾀｰ
		//-------------------------------------------------
		public function getPassword() {
			return $this->password;
		}

	//-----------------------------------------------------
	// ﾒｿｯﾄﾞ
	//-----------------------------------------------------
		//-------------------------------------------------
		// name   : Exist
		// param  : $sql       SQL
		//          $param     ﾊﾟﾗﾒｰﾀ
		// return : true 条件に一致する　false 条件に一致しない
		// remark : 条件に一致するﾚｺｰﾄﾞが存在するかをﾁｪｯｸする
		//-------------------------------------------------
		public  function Exist($sql,$param){
			$ret =false;	// 返却値
			$index = 1;     // ｲﾝﾃﾞｯｸｽ
			// ｴﾗｰﾄﾗｯﾌﾟ
			try{
				// DBｵｰﾌﾟﾝ
				$pdo = new PDO($this->getDsn(),$this->getUser(),$this->getPassword());
				// SQL設定
				$stmt = $pdo->prepare($sql);
				// ﾊﾟﾗﾒｰﾀ設定
				foreach ($param as $value){
					$stmt->bindValue($index, $value);
					$index++;
				}
				// SQLを実行して件数を取得
				$stmt->execute();
				// 取得した件数を判定
				$cnt = $stmt->fetchColumn();
				// 件数が0件以上の場合はtrue
				if($cnt > 0){
					$ret = true;
				}
			}catch (PDOException $e){
				print('Error:'.$e->getMessage());
				die();
			}
			// 接続をｸﾘｱ
			$pdo = null;
			// 条件に一致したかを返却
			return $ret;
		}
		//-------------------------------------------------
		// name   : Select
		// param  : $sql
		// return : 取得したﾚｺｰﾄﾞ
		// remark : SQLを実行してﾚｺｰﾄﾞを取得
		//-------------------------------------------------
		public  function Select($sql,$param){
			$ret =null;	// 返却値
			$index = 1;     // ｲﾝﾃﾞｯｸｽ
			// ｴﾗｰﾄﾗｯﾌﾟ
			try{
				// DBｵｰﾌﾟﾝ
				$pdo = new PDO($this->getDsn(),$this->getUser(),$this->getPassword());
				// SQL設定
				$stmt = $pdo->prepare($sql);
				// ﾊﾟﾗﾒｰﾀ設定
				foreach ($param as $value){
					$stmt->bindValue($index, $value);
					$index++;
				}
				// 文字ｺｰﾄﾞ変換
				$pdo->query("set names utf8");
				// SQLを実行して件数を取得
				$stmt->execute();
				// 取得した結果を配列に設定
				$ret = $stmt->fetchAll();
			}catch (PDOException $e){
				print('Error:'.$e->getMessage());
				die();
			}
			// 接続をｸﾘｱ
			$pdo = null;
			// 条件に一致したかを返却
			return $ret;
		}
		//-------------------------------------------------
		// name   : Execute
		// param  : $sql       SQL
		//          $param     ﾊﾟﾗﾒｰﾀ
		// return : ﾚｺｰﾄﾞ
		// remark : SQLを実行して挿入、更新、削除を行う
		//-------------------------------------------------
		public  function Execute($sql,$param){
			$ret =false;	// 返却値
			$index = 1;     // ｲﾝﾃﾞｯｸｽ
			// ｴﾗｰﾄﾗｯﾌﾟ
			try{
				// DBｵｰﾌﾟﾝ
				$pdo = new PDO($this->getDsn(),$this->getUser(),$this->getPassword());
				// ﾄﾗﾝｻﾞｸｼｮﾝ開始
				$pdo->beginTransaction();
				// 文字ｺｰﾄﾞ変換
				$pdo->query("set names utf8");
				// SQL設定
				$stmt = $pdo->prepare($sql);
				// ﾊﾟﾗﾒｰﾀ設定
				foreach ($param as $value){
					$stmt->bindValue($index, $value);
					$index++;
				}
				// SQLを実行して件数を取得
				$stmt->execute();
				// ｺﾐｯﾄ
				$pdo->commit();
				// 正常処理
				$ret = true;
			}catch (PDOException $e){
				print('Error:'.$e->getMessage());
				// ﾛｰﾙﾊﾞｯｸ
				$pdo->rollBack();
				die();
			}
			// 接続をｸﾘｱ
			$pdo = null;
			// 条件に一致したかを返却
			return $ret;
		}

}