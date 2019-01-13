<?php
//======================================================================
// name    : Utility
// remarks : ﾕｰﾃｨﾘﾃｨﾛｼﾞｯｸｸﾗｽ
//======================================================================
class Utility {
	//-----------------------------------------------------
	// ﾒｿｯﾄﾞ
	//-----------------------------------------------------

		//-------------------------------------------------
		// name   : dateFormat
		// param  : $date 日付
		// return : YYYY / MM / DD の日付
		//-------------------------------------------------
		public static function dateFormat($date){
			$year  = substr($date, 0, 4);
			$month = substr($date, 4, 2);
			$day   = substr($date, 6, 2);

			return $year.' / '.$month.' / '.$day;
		}
		//-------------------------------------------------
		// name   : timeFormat
		// param  : $time 時間
		// return : HH : MM の日付
		//-------------------------------------------------
		public static function timeFormat($time){
			$hour  = substr($time, 0, 2);
			$min   = substr($time, 2, 2);

			return $hour.' : '.$min;
		}
		//-------------------------------------------------
		// name   : dateFormatJap
		// param  : $date 日付
		// return : YYYY / MM / DD の日付
		//-------------------------------------------------
		public static function dateFormatJap($date){
			$year  = substr($date, 0, 4);
			$month = substr($date, 4, 2);
			$day   = substr($date, 6, 2);

			return $year.' 年 '.$month.' 月 '.$day.' 日 ';
		}
		//-------------------------------------------------
		// name   : timeFormatJap
		// param  : $time 時間
		// return : HH : MM の日付
		//-------------------------------------------------
		public static function timeFormatJap($time){
			$hour  = substr($time, 0, 2);
			$min   = substr($time, 2, 2);

			return $hour.' 時 '.$min.' 分 ';
		}
		//-------------------------------------------------
		// name   : startYMD
		// param  : $date 日付
		// return : YYYY0101 の日付
		//-------------------------------------------------
		public static function startYMD($date){
			$year  = substr($date, 0, 4);
			$month = substr($date, 4, 2);
			$day   = substr($date, 6, 2);

			return $year.'0101';
		}
		//-------------------------------------------------
		// name   : endYMD
		// param  : $date 日付
		// return : YYYY1231 の日付
		//-------------------------------------------------
		public static function endYMD($date){
			$year  = substr($date, 0, 4);

			return $year.'1231';
		}
}