//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// history.js
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,


	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// Load
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
	$(function(){
		// 履歴取得処理
		callHistory('','');
		// ﾘｽﾄﾃﾞｰﾀ取得処理
		callSelectDate();

		// 照会ﾎﾞﾀﾝのｲﾍﾞﾝﾄ設定
		$('.square_btn').on('click',function(){
			// ｾｯｼｮﾝの生存確認
			sessionAlive();
			var sel = $('.date');
			var opt = sel.find('option:selected').val();
			_data = opt.split('_');
			// 履歴取得処理
			callHistory(_data[0],_data[1]);
		});
		// ﾓｰﾀﾞﾙの表示ｲﾍﾞﾝﾄ設定
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
		// name   : callHistory
		// param  : _date 日付(YYYYMMDD)
		//        : _time 時間(HHmm)
		// return : なし
		// remark : ajaxで履歴取得を行い表示する
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		function callHistory(_date,_time){
			// ajaxで履歴取得処理をｺｰﾙ
			$.ajax({
		        type: 'post',
		        url: '../php/history.php',
		        data: {
		        	date:_date,
		        	time:_time
		        }
		    }).then(function( ret ){
		    	var json = JSON.parse(ret);
		    	var html = '';
		    	var total = '';
		    	var name = '';
		    	var record = '';

		    	name += "<tr>";
		    	name += "<th class='head-column blank'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>";
		    	total += "<tr>";
		    	total += "<th class='data-total blank'>計</th>";

		    	$.each(json,function(i,val){
		    		var $t = val;
		    		// ﾌﾟﾚｲﾔｰ名称と合計を取得
			    	$.each($t.total,function(_i,_v){
			    		name += "<td class='data-column'>";
						name += _v.name;
						name += "<input type='hidden' value = '" + _v.player + "'>";
						name += "</td>";
						total += "<td class='data-total'>";
		    			total += _v.total;
		    			total += "</td>";

					});
			    	name += "</tr>";
			    	total += "</tr>";

			    	var count = 0;
			    	$.each($t.data,function(_i2,_v2){
			    		if(_v2.times != count){
			    			record += "<tr>";
		    				count = _v2.times;
		    				record += "<th>" + zeroPadding(_v2.times,2) + "回戦</th>";
		    				$.each($t.total,function(_i3,_v3){
				    			record += "<td id='" + _v3.player + "_" + _v2.times + "' class='data-column'>-</td>";
				    		});
		    				record += "</tr>";
		    			}
			    	});
		    	});
		    	$('#tablearea').find('thead').html(name);
		    	$('#tablearea').find('tbody').html(record);
		    	$('#tablearea').find('tfoot').html(total);
		    	$('.modal_close').click();

		    	$.each(json,function(i,val){
		    		var $t = val;
		    		$.each($t.data,function(_i4,_v4){
		    			$("#" + _v4.code + "_" + _v4.times).text(_v4.record)
		    		});
		    	});

		    },
		    function(e){
		    });
	    	var sel = $('.date');
			var opt = sel.find('option:selected').text();

			$('.period').text(opt);
		}

		//'''''''''''''''''''''''''''''''''''''''''''''''''''''''
		// name   : callSelectDate
		// param  : なし
		// return : なし
		// remark : ajaxで照会日付の取得を行い表示する
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		function callSelectDate(){
			// ajaxで日付取得処理をｺｰﾙ
			$.ajax({
		        type: 'post',
		        url: '../php/yeardatelist.php',
		        data: {
		        }
		    }).then(function( ret ){
		    	var json = JSON.parse(ret);
		    	var year = '';
		    	var date = '';
		    	$.each(json,function(i,val){
		    		var $t = val;
		    		$.each($t.yearlist,function(i,val){
		    			year += "<option value='" + val.year + "'>" + val.year + "年</option>";
		    		});
		    		$.each($t.datelist,function(i,val){
		    			_date = val.date.split(' / ').join('');
		                _time = val.time.split(' : ').join('');
		    			date += "<option value='" + _date + "_" + _time + "'>" + val.date + " " + val.time + "</option>";
		    		});
		    	});
		    	$('.year').html(year);
		    	$('.date').html(date);

		    	var sel = $('.date');
		    	$('.date option:last-child').attr('selected', true);
				var opt = sel.find('option:selected').text();

				$('.period').text(opt);
		    },
		    function(e){
		    });
		}

	});