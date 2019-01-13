/**********************************************************
 *  index.js
 *********************************************************/

	//''''''''''''''''''''''''''''''''''''''''
	// 定数
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		const LOGIN_ERR_MSG = 'IDまたはPASSWORDが違います。';

	//''''''''''''''''''''''''''''''''''''''''
	// 処理
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		$(function(){
			var fadein = function(){
				$('body').fadeMover({
					'effectType': 2,
					'inSpeed': 800,
					'inDelay' : '0',
					'nofadeOut' : 'nonmover'
				});
			}
			var fadeout = function(){
				$('body').fadeMover({
					'effectType': 3,
					'outSpeed': 800,
					'outDelay' : '0',
					'nofadeOut' : 'nonmover'
				});
			}
			fadein();
			$('.square_btn').on('click',function(){
				// ｴﾗｰﾒｯｾｰｼﾞをｸﾘｱ
				$('.msg').text('');
				// ajaxでｻｰﾊﾞのﾛｸﾞｲﾝ処理をｺｰﾙ
				$.ajax({
			        type: 'post',
			        url: './php/index.php',
			        data: {
			        	userid :$('.txt-login').val(),
			        	password :$('.pwd-login').val()
			        }
			    }).then(function( ret ){

			    	fadeout();
			    	// ﾛｸﾞｲﾝ成功時は画面遷移
			    	window.location.href = ret;
			    },
			    function(e){
			    	// ﾛｸﾞｲﾝ失敗時はｴﾗｰﾒｯｾｰｼﾞを表示
			    	$('.msg').text(LOGIN_ERR_MSG);
			    });
			});
		});
