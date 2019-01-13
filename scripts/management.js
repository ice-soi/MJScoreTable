//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// management.js
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// 定数
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		const CREATE = "0";		// 作成
		const DELETE = "1";		// 削除
		const UPDATE = "2";		// 更新

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// Load
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		$(function(){
			// ﾌﾟﾚｲﾔｰﾘｽﾄ作成処理
			callPlayerList();
			// 登録ﾎﾞﾀﾝのｲﾍﾞﾝﾄ設定
			$('.square_btn').on('click',function(){
				// ｾｯｼｮﾝの生存確認
				sessionAlive();
				// ajaxでｻｰﾊﾞのﾌﾟﾚｲﾔｰ作成処理をｺｰﾙ
				$.ajax({
			        type: 'post',													// POST
			        url: '../php/player.php',										// ﾘｸｴｽﾄURL
			        data: {
			        	playerid :$('.playerid').val(),								// ﾌﾟﾚｲﾔｰID
			        	name :$('.txt-title').val(),								// ﾌﾟﾚｲﾔｰ名
			        	comment :$('.txt-remarks').val(),							// ｺﾒﾝﾄ
			        	status :($('.playerid').val() == 0) ? CREATE : UPDATE		// 更新ｽﾃｰﾀｽ
			        }
			    }).then(function( ret ){
			    	// ﾛｸﾞｲﾝ成功時は画面遷移
			    	window.location.href = ret;
			    },
			    function(e){
			    });
			});
			// 削除ﾎﾞﾀﾝのｲﾍﾞﾝﾄ設定
			$('.delete_btn').on('click',function(){
				// ｾｯｼｮﾝの生存確認
				sessionAlive();
				// ajaxでｻｰﾊﾞのﾛｸﾞｲﾝ処理をｺｰﾙ
				$.ajax({
			        type: 'post',													// POST
			        url: '../php/player.php',										// ﾘｸｴｽﾄURL
			        data: {
			        	playerid :$('.playerid').val(),								// ﾌﾟﾚｲﾔｰID
			        	name :$('.txt-title').val(),								// ﾌﾟﾚｲﾔｰ名
			        	comment :$('.txt-remarks').val(),							// ｺﾒﾝﾄ
			        	status :DELETE												// 更新ｽﾃｰﾀｽ
			        }
			    }).then(function( ret ){
			    	// ﾛｸﾞｲﾝ成功時は画面遷移
			    	window.location.href = ret;
			    },
			    function(e){
			    });
			});

			// ｽｸﾛｰﾙ設定
			setScroll($("table"));

		//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
		// ﾒｿｯﾄﾞ
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

			//'''''''''''''''''''''''''''''''''''''''''''''''''''''''
			// name   : callPlayerList
			// param  : なし
			// return : なし
			// remark : ajaxでﾌﾟﾚｲﾔｰﾘｽﾄ取得
			//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function callPlayerList(){
				// ajaxでｻｰﾊﾞのﾌﾟﾚｲﾔｰ作成処理をｺｰﾙ
				$.ajax({
			        type: 'post',													// POST
			        url: '../php/management.php',									// ﾘｸｴｽﾄURL
			        data: {
			        }
			    }).then(function( ret ){
			    	var json = JSON.parse(ret);
			    	var html = '';
			    	// ｶﾞｰﾄﾞﾚｲﾔｰを張る
			    	dispLoading();
			    	// ﾚｽﾎﾟﾝｽのJSONﾃﾞｰﾀを元にﾌﾟﾚｲﾔｰﾘｽﾄのHTMLを作成
			    	$.each(json,function(i,val){
			    		var $t = val;
			    		html += "<div class='management-date'>";
			    		html += "<a rel='leanModal' href='#modal-window'  class='period' id='" + $t.playercode + "' >";
			    		html += "<span class='name'>";
			        	html += $t.playername;
			        	html += "</span>";
			         	html += "<span class='comment'>";
			        	html += $t.comment;
			        	html += "</span>";
			        	html += "</a>";
			        	html += "</div>";
			    	});
			    	// ｶﾞｰﾄﾞﾚｲﾔｰをはがす
			    	removeLoading();
			    	// 作成したHTMLを設定
			    	$('#tablearea').find('tbody').html(html);
			    	// ﾓｰﾀﾞﾙのｲﾍﾞﾝﾄ設定
			    	$( 'a[rel*=leanModal]').click(function(){
			    		var id = $(this).attr('id');
			    		$('.playerid').val(id);
			    		if(id != 0)
			    			{
			    				$('.txt-title').val($(this).children().eq(0).text());
			    				$('.txt-remarks').val($(this).children().eq(1).text());
			    			}
			    	}).leanModal({
			    	    top: 50,                     // #modal-windowの縦位置
			    	    overlay : 0.7,               // #modal-windowの背面の透明度
			    	    closeButton: ".modal_close"  // #modal-windowを閉じるボタンのdivのclass
			    	})
			    },
			    function(e){
			    	removeLoading();
			    });
			}
		});