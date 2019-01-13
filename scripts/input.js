//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// input.js
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// 定数
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		const CREATE = "0";
		const DELETE = "1";
		const UPDATE = "2";
		const SCORE_TOTAL_ERROR = '得点の合計は0になります';
		const SCORE_COUNT_ERROR = '参加者が4人入力してください';

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// Load
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		$(function(){

		//'''''''''''''''''''''''''''''''''''''''''''''''''''''''
		// ｸﾛｰｼﾞｬｰ
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			var setScheduleInput = function(_d)
		    {
		        // 日付ｵﾌﾟｼｮﾝ
		        var date_options = {
		            language: "ja",
		            clearBtn: true,
		            dateFormat: "yy / mm / dd"
		        };

		        // ﾊﾟﾗﾒｰﾀに日付ﾃﾞｰﾀがない場合は改めて取得
		        var d = (_d) ? _d : new Date();

		        // datepicker
		        $("#from-date").datepicker(date_options).datepicker("setDate", d);

		        // timepickerのﾃﾞﾌｫﾙﾄ時間を設定
		        var dt = new Date();
		        var h = dt.getHours();
		        var m = dt.getMinutes();
		        m = Math.floor(m / 15) * 15;

		        $('#from-time').val(('0' + h).slice(-2) + " : " + ('0' + m).slice(-2));

		        // 時間ｵﾌﾟｼｮﾝ
		        var time_options = {
		            show_meridian: false,
		            min_hour_value: 0,
		            max_hour_value: 23,
		            step_size_minutes: 15,
		            overflow_minutes: true,
		            increase_direction: 'up',
		            disable_keyboard_mobile: true
		        };
		        // timepicker
		        $('#from-time').timepicki(time_options);

		    }

			// ajaxでｻｰﾊﾞのﾌﾟﾚｲﾔｰﾘｽﾄ取得処理をｺｰﾙ
			$.ajax({
		        type: 'post',					// POST
		        url: '../php/inputlist.php',	// ﾘｸｴｽﾄURL
		        data: {
		        }
		    }).then(function( ret ){
		    	var json = JSON.parse(ret);
		    	var html = '';
		    	// ﾚｽﾎﾟﾝｽ
		    	$.each(json,function(i,val){
		    		var $t = val;
		    		html += "<div class='record-date'>";
		    		html += "<a rel='leanModal' href='#modal-window'  class='period' id='";
		    		html += $t.date.split(' / ').join('') +  $t.time.split(' : ').join('');
		    		html += "' >";
		         	html += "<span class='record-date'>";
		        	html += $t.date;
		        	html += "</span>";
		         	html += "<span class='record-time'>";
		        	html += $t.time;
		        	html += "</span>";
		    		html += "<span class='record-title'>";
		        	html += $t.title;
		        	html += "</span>";
		        	html += "</a>";
		        	html += "</div>";
		    	});
		    	// ﾃｰﾌﾞﾙｴﾘｱ
		    	$('#tablearea').find('tbody').html(html);
		    	$( 'a[rel*=leanModal]').click(function(){
		    		_date = $(this).children().eq(0).text().split(' / ').join('');
		            _time = $(this).children().eq(1).text().split(' : ').join('');
		            // ｾｯｼｮﾝの生存確認
					sessionAlive();
		            dispLoading();
		    		$.ajax({
		    	        type: 'post',
		    	        url: '../php/inputdetail.php',
		    	        data: {
		    	        	date:_date,
		    				time:_time
		    	        }
		    	    }).then(function( ret ){
		    	    	var json = JSON.parse(ret);
		    	    	var html = '';
		    	    	var head = '';

			    		$.each(json,function(i,val){
		   	    			var $t = val;

		   	    			$('.input-form').find('thead').empty();
		   	    			$('.input-form').find('tbody').empty();
		   	    			head += "<tr>";
		   	    			head += "<th class='head-column blank'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>";
		   		    		$.each($t.player,function(_i,_v){
		   		    			head += "<td class='data-column'>" +_v.name + "<input type='hidden' class='playercode' value='" + _v.player + "'></td>";
		   		    		});
		   		    		head += "</tr>";
		   		    		for(i = 1;i <= 20;i++){
		   		    			html += "<tr>";
		   		    			html += "<th>" + zeroPadding(i,2) + "回戦</th>";
		   		    			$.each($t.player,function(_i,_v){
		   			    			html += "<td>";
		   	    					html += "<input type='text' class='record-input " + _v.player + "_" + i + "' value='" + "" + "' />";
		   	    					html += "</td>";
		   		    			});
		   		    			//html += "<td>&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
		   		    			html += "</tr>";
		   		    		}
		   		    		$('.input-form').find('thead').append(head);
		    	    		$('.input-form').find('tbody').append(html);
		    	    		html = '';

		    	    		$.each($t.data,function(_i2,_v2){
		    	    			var key = _v2.code + "_" + _v2.times;
		    					$("." + key).val(_v2.record);
		    	    		});
		    	    	});
		    	    	removeLoading();
		    	    },
		    	    function(e){
		    	    	removeLoading();
		    	    });
		    		var id = $(this).attr('id');
		    		$('.inputno').val(id);
		    		if(id != "0")
					{
						$('.txt-title').val($(this).children().eq(2).text());

						$('.beforedate').val($(this).children().eq(0).text());
				        $('.beforetime').val($(this).children().eq(1).text());

						$("#from-date").val($(this).children().eq(0).text());
						$('#from-time').val($(this).children().eq(1).text());
					} else {
						setScheduleInput(new Date());
						$('.txt-title').val('');
					}
		    	}).leanModal({
		    	    top: 50,                     // #modal-windowの縦位置
		    	    overlay : 0.7,               // #modal-windowの背面の透明度
		    	    closeButton: ".modal_close"  // #modal-windowを閉じるボタンのdivのclass
		    	});
		    },
		    function(e){
		    	removeLoading();
		    });
			setScheduleInput(new Date());
			$('.square_btn').on('click',function(){
				_date = $('.txt-date').val().split(' / ').join('');
		        _time = $('.txt-time').val().split(' : ').join('');
		        _beforedate = $('.beforedate').val().split(' / ').join('');
		        _beforetime = $('.beforetime').val().split(' : ').join('');

		        var msg = validateCheck();
		        if(msg){
		        	alert(msg);
		        	return false;
		        }
		        dispLoading();
		        var records = [];
		        $('.playercode').each(function(){
		        	var code = $(this).val();
		        	var rec = [];

		        	rec.push(code);
		        	for(i = 1;i <= 20; i++)
		        	{
		        		rec.push($('.' + code + '_' + i).val())
		        	}
		        	records.push(rec);
		        });
				// ajaxでｻｰﾊﾞのﾌﾟﾚｲﾔｰ作成処理をｺｰﾙ
				$.ajax({
			        type: 'post',
			        url: '../php/input.php',
			        data: {
			        	date :_date,
			        	time :_time,
			        	beforedate :_beforedate,
			        	beforetime :_beforetime,
			        	title :$('.txt-title').val(),
			        	records:records,
			        	status :($('.inputno').val() == 0) ? CREATE : UPDATE
			        }
			    }).then(function( ret ){
			    	// ﾛｸﾞｲﾝ成功時は画面遷移
			    	window.location.href = ret;
			    	removeLoading();
			    },
			    function(e){
			    	removeLoading();
			    });
			});
			$('.delete_btn').on('click',function(){
				_date = $('.txt-date').val().split(' / ').join('');
				_time = $('.txt-time').val().split(' : ').join('');
				_beforedate = $('.beforedate').val().split(' / ').join('');
		        _beforetime = $('.beforetime').val().split(' : ').join('');
		        dispLoading();
				// ajaxでｻｰﾊﾞのﾛｸﾞｲﾝ処理をｺｰﾙ
				$.ajax({
			        type: 'post',
			        url: '../php/input.php',
			        data: {
			        	date :_date,
			        	time :_time,
			        	beforedate :_beforedate,
			        	beforetime :_beforetime,
			        	title :$('.txt-title').val(),
			        	records:'',
			        	status :DELETE
			        }
			    }).then(function( ret ){
			    	// ﾛｸﾞｲﾝ成功時は画面遷移
			    	window.location.href = ret;
			    },
			    function(e){
			    	removeLoading();
			    });
			});

			// ｽｸﾛｰﾙ設定
			setScroll($("table").eq(0));
			// ﾓｰﾀﾞﾙのｽｸﾛｰﾙ設定
			setScrollSub();
		//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
		// 関数
		//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

			//'''''''''''''''''''''''''''''''''''''''''
			// name   : validateCheck
			// param  : none
			// remark : 入力ﾁｪｯｸ
			//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
			function validateCheck()
			{
				var tmp = 0;
				var cnt = 0;
		   		for(i = 1;i <= 20;i++){
		   			$('.playercode').each(function(){
		   				var code = $(this).val();
		   				var val = $('.' + code + '_' + i).val();
		   				if(!val){
		   					return true;
		   				}
		   				if(!isNaN(val)){
		   					tmp += parseInt(val,10);
		   					cnt += 1;
		   				}
		   			});
		   			if(cnt != 0 && cnt != 4){
		   				return SCORE_COUNT_ERROR;
		   			}
		   			if(tmp != 0){
		   				return SCORE_TOTAL_ERROR;
		   			}
		   			tmp = 0;
		   			cnt = 0;
		   		}
		   		return "";
			}
			//'''''''''''''''''''''''''''''''''''''''''
			// name   : setScrollSub
			// param  : none
			// remark : ｽｸﾛｰﾙｲﾍﾞﾝﾄ設定
			//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
				function setScrollSub() {
					$("#page-top-input").on('click',function(){
						$("#page-top-input").prop('disabled', true);
						var pos = $("table").eq(1).scrollTop() - 200;
						$("table").eq(1).animate({scrollTop:pos}, 250, "swing");
						$("#page-top-input").prop('disabled', false);
					});
					$("#page-bottom-input").on('click',function(){
						$("#page-bottom-input").prop('disabled', true);
						var pos = $("table").eq(1).scrollTop() + 200;
						$("table").eq(1).animate({scrollTop:pos}, 250, "swing");
						$("#page-bottom-input").prop('disabled', false);
					});
					$("#page-left-input").on('click',function(){
						$("#page-left-input").prop('disabled', true);
						var pos = $("table").eq(1).scrollLeft() - 400;
						$("table").eq(1).animate({scrollLeft:pos}, 250, "swing");
						$("#page-left").prop('disabled', false);
					});
					$("#page-right-input").on('click',function(){
						$("#page-right").prop('disabled', true);
						var pos = $("table").eq(1).scrollLeft() + 400;
						$("table").eq(1).animate({scrollLeft:pos}, 250, "swing");
						$("#page-right").prop('disabled', false);
					});
				}

		});