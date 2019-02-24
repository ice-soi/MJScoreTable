//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// aggregate.js
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// Load
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
	$(function(){
		// 集計情報を取得する
		callAggregate('');
		// 選択した年を取得する
		callSelectYear();
		// 登録ﾎﾞﾀﾝのｲﾍﾞﾝﾄ設定
		$('.square_btn').on('click',function(){
			var sel = $('.year');
			var opt = sel.find('option:selected').val();
			// ｾｯｼｮﾝの生存確認
			sessionAlive();
			// ﾘｽﾄの選択値に基づき集計情報を取得する
			callAggregate(opt);
		});
		// ﾓｰﾀﾞﾙのｲﾍﾞﾝﾄ設定
		$( 'a[rel*=leanModal]').leanModal({
			    top: 50,                     // #modal-windowの縦位置
			    overlay : 0.7,               // #modal-windowの背面の透明度
			    closeButton: ".modal_close"  // #modal-windowを閉じるボタンのdivのclass
	    });
		// ｽｸﾛｰﾙ設定
		setScroll($("table"));

		//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
		// ﾒｿｯﾄﾞ
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

			//'''''''''''''''''''''''''''''''''''''''''''''''''''''''
			// name   : callAggregate
			// param  : _year 年(YYYY)
			// return : なし
			// remark : ajaxで履歴取得を行い表示する
			//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function callAggregate(_year){
				// ajaxで集計取得処理をｺｰﾙ
				$.ajax({
			        type: 'post',					// POST
			        url: '../php/aggregate.php',	// ﾘｸｴｽﾄURL
			        data: {
			        	year:_year					// 年
			        }
			    }).then(function( ret ){
			    	var json = JSON.parse(ret);
			    	var html = '';
			    	var head = '';
			    	// 集計情報のﾍｯﾀﾞｰHTMLを作成
			    	head += "<tr>";
			    	head += "<th class='head-column'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>";
			    	head += "<td class='data-column'>";
			    	head += "得点数";
			    	head += "</td>";
			    	head += "<td class='data-column'>";
			    	head += "一位数";
			    	head += "</td>";
			    	head += "<td class='data-column'>";
			    	head += "二位数";
			    	head += "</td>";
			    	head += "<td class='data-column'>";
			    	head += "三位数";
			    	head += "</td>";
			    	head += "<td class='data-column'>";
			    	head += "四位数";
			    	head += "</td>";
			    	head += "<td class='data-column'>";
			    	head += "半荘数";
			    	head += "</td>";
			    	head += "<td class='data-column'>";
			    	head += "トップ率";
			    	head += "</td>";
			    	head += "<td class='data-column'>";
			    	head += "平均得点";
			    	head += "</td>";
			    	head += "</tr>";
			    	// ﾚｽﾎﾟﾝｽの集計情報を元にﾘｽﾄHTMLを作成
			    	$.each(json,function(i,val){
			    		var $t = val;
			    		var count = 0;

			    		html += "<tr>";
			    		html += "<th>" + val.name + "</th>";
			    		html += "<td class='data-column'>" + val.score + "</td>";
			    		html += "<td class='data-column'>" + val.first + "</td>";
			    		html += "<td class='data-column'>" + val.second + "</td>";
			    		html += "<td class='data-column'>" + val.third + "</td>";
			    		html += "<td class='data-column'>" + val.fourth + "</td>";
			    		html += "<td class='data-column'>" + val.total + "</td>";
			    		html += "<td class='data-column'>" + val.topper + "</td>";
			    		html += "<td class='data-column'>" + val.avarage + "</td>";
			    		html += "</tr>";
			    	});
			    	// ﾍｯﾀﾞｰにHTMLを設定
			    	$('#tablearea').find('thead').html(head);
			    	// tbodyにHTMLを設定
			    	$('#tablearea').find('tbody').html(html);
			    	// ﾓｰﾀﾞﾙを閉じる
			    	$('.modal_close').click();
			    	// ｽｸﾛｰﾙのﾌﾟﾗｸﾞｲﾝを設定
//			    	$("tbody").mCustomScrollbar({
//			    	    verticalScroll:true,
//			    	    axis:"xy",
//			    	    advanced:{
//			    	    	updateOnContentResize: true,
//			    	    	autoExpandHorizontalScroll:true
//			            }
//			    	});
			    },
			    function(e){
			    });
		    	var sel = $('.year');
				var opt = sel.find('option:selected').text();

				$('.period').text(opt);
			}
			//'''''''''''''''''''''''''''''''''''''''''''''''''''''''
			// name   : callSelectDate
			// param  : なし
			// return : なし
			// remark : ajaxで照会年の取得を行い表示する
			//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function callSelectYear(){
				// ajaxで日付取得処理をｺｰﾙ
				$.ajax({
			        type: 'post',
			        url: '../php/yearlist.php',
			        data: {
			        }
			    }).then(function( ret ){
			    	var json = JSON.parse(ret);
			    	var html = '';

			    	html += "<option value=''>総計</option>";

			    	$.each(json,function(i,val){
				    	html += "<option value='" + val.year + "'>" + val.year + "年</option>";
			    	});

			    	$('.year').html(html);

			    	var sel = $('.year');
					var opt = sel.find('option:selected').text();

					$('.period').text(opt);
			    },
			    function(e){
			    });
			}
	});