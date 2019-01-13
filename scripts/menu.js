//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// menu.js
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// 定数
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		const HOME            = 0;
		const HISTORY         = 1;
		const AGGREGATE       = 2;
		const INPUT           = 3;
		const SCHEDULE        = 4;
		const MANAGEMENT      = 5;
		const LOGOUT          = 6;
		const LOGOUT_MSG      = '退出しますか？';
		const HOME_PAGE       = './home.html';
		const HISTORY_PAGE    = './history.html';
		const AGGREGATE_PAGE  = './aggregate.html';
		const INPUT_PAGE      = './input.html';
		const SCHEDULE_PAGE   = './schedule.html';
		const MANAGEMENT_PAGE = './management.html';
		const INDEX_PAGE      = '../index.html';

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// Load
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		$(function(){
			var fade = function(type){
				$('.contents').fadeMover({
					'effectType': type,
					'inSpeed': 800,
					'outSpeed': 800,
					'inDelay' : '0',
					'outDelay' : '0',
					'nofadeOut' : 'nonmover'
				});
			}
			// ｾｯｼｮﾝの生存確認
			sessionAlive();
			// ﾌｪｰﾄﾞｲﾝ
			fade(2);
			// ﾒﾆｭｰのｲﾍﾞﾝﾄﾊﾝﾄﾞﾗ
			$('.menu-item').each(function(i){
				var path = '';
				switch(i)
				{
					case HOME:
						path = HOME_PAGE;
						break;
					case HISTORY:
						path = HISTORY_PAGE;
						break;
					case AGGREGATE:
						path = AGGREGATE_PAGE;
						break;
					case INPUT:
						path = INPUT_PAGE;
						break;
					case SCHEDULE:
						path = SCHEDULE_PAGE;
						break;
					case MANAGEMENT:
						path = MANAGEMENT_PAGE;
						break;
					case LOGOUT:
						path = INDEX_PAGE;
						break;
					default:
						break;
				}
				$(this).on('click',function(){
					if(path == INDEX_PAGE)
					{
						if(!confirm(LOGOUT_MSG))
						{
							return;
						}
					}
					fade(3);
					window.location.href = path;
				});
			});
		});

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// 共通ﾒｿｯﾄﾞ
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

		//'''''''''''''''''''''''''''''''''''''''''
		// name   : dispLoading
		// param  : none
		// remark : ﾛｰﾃﾞｨﾝｸﾞｲﾒｰｼﾞを表示
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function dispLoading() {
			    // ﾛｰﾃﾞｨﾝｸﾞが表示されていない場合表示する
			    if ($("#loading").length == 0) {
			        $("body").append("<div id='loading'><div class='loadingMsg'>Now Loading</div></div>");
			        $('.modal_close').click();
			    }
			}
		//'''''''''''''''''''''''''''''''''''''''''
		// name   : removeLoading
		// param  : none
		// remark : ﾛｰﾃﾞｨﾝｸﾞｲﾒｰｼﾞを非表示
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function removeLoading() {
			    // ﾛｰﾃﾞｨﾝｸﾞを削除
			    $("#loading").remove();
			}
		//'''''''''''''''''''''''''''''''''''''''''
		// name   : zeroPadding
		// param  : num     数字
		//        : length  桁数
		// remark : 任意の桁数まで0ﾊﾟﾃﾞｨﾝｸﾞする
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function zeroPadding(num,length){
			    return ('0000000000' + num).slice(-length);
			}
		//'''''''''''''''''''''''''''''''''''''''''
		// name   : sessionAlive
		// param  : none
		// remark : ｾｯｼｮﾝの生存判定しﾛｸﾞｲﾝ画面に遷移する
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function sessionAlive() {
			    // ｾｯｼｮﾝの生存判定
				$.ajax({
			        type: 'post',
			        url: '../php/SessionAlive.php',
			        data: {
			        }
			    }).then(function( ret ){
			    	if(ret){
			    		window.location.href = INDEX_PAGE;
			    	}
			    });
			}
		//'''''''''''''''''''''''''''''''''''''''''
		// name   : setScroll
		// param  : $target  ｽｸﾛｰﾙ対象
		// remark : ｽｸﾛｰﾙｲﾍﾞﾝﾄ設定
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function setScroll($target) {
				$("#page-top").on('click',function(){
					$("#page-top").prop('disabled', true);
					var pos = $target.scrollTop() - 200;
					$target.animate({scrollTop:pos}, 250, "swing");
					$("#page-top").prop('disabled', false);
				});
				$("#page-bottom").on('click',function(){
					$("#page-bottom").prop('disabled', true);
					var pos = $target.scrollTop() + 200;
					$target.animate({scrollTop:pos}, 250, "swing");
					$("#page-bottom").prop('disabled', false);
				});
				$("#page-left").on('click',function(){
					$("#page-left").prop('disabled', true);
					var pos = $target.scrollLeft() - 400;
					$target.animate({scrollLeft:pos}, 250, "swing");
					$("#page-left").prop('disabled', false);
				});
				$("#page-right").on('click',function(){
					$("#page-right").prop('disabled', true);
					var pos = $target.scrollLeft() + 400;
					$target.animate({scrollLeft:pos}, 250, "swing");
					$("#page-right").prop('disabled', false);
				});
			}