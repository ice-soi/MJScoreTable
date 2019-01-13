//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
// schedule.js
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// 定数
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		const CREATE = "0";
		const DELETE = "1";
		const UPDATE = "2";

	//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	// Load
	//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		$(function(){

			//'''''''''''''''''''''''''''''''''''''''''''''''''''
			// ｸﾛｰｼﾞｬｰ
			//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
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

			// ajaxでｻｰﾊﾞのﾌﾟﾚｲﾔｰ作成処理をｺｰﾙ
			$.ajax({
		        type: 'post',
		        url: '../php/schedulelist.php',
		        data: {
		        }
		    }).then(function( ret ){
		    	var json = JSON.parse(ret);
		    	var html = '';
		        dispLoading();
		    	$.each(json,function(i,val){
		    		var $t = val;
		    		html += "<div class='schedule-date'>";
		    		html += "<a rel='leanModal' href='#modal-window'  class='period' id='";
		    		html += $t.date.split(' / ').join('') +  $t.time.split(' : ').join('');
		    		html += "' >";
		    		html += "<span class='schedule-title'>";
		        	html += $t.title;
		        	html += "</span>";
		         	html += "<span class='schedule-date'>";
		        	html += $t.date;
		        	html += "</span>";
		         	html += "<span class='schedule-time'>";
		        	html += $t.time;
		        	html += "</span>";
		         	html += "<span class='schedule-remarks'>";
		        	html += $t.remarks;
		        	html += "</span>";
		        	html += "</a>";
		        	html += "</div>";
		    	});
		    	$('#tablearea').find('tbody').html(html);
		    	$( 'a[rel*=leanModal]').click(function(){
		    		var id = $(this).attr('id');
		    		$('.scheduleno').val(id);
		    		if(id)
					{
						$('.txt-title').val($(this).children().eq(0).text());
						$('.txt-remarks').val($(this).children().eq(3).text());

						$('.beforedate').val($(this).children().eq(1).text());
				        $('.beforetime').val($(this).children().eq(2).text());

						$("#from-date").val($(this).children().eq(1).text());
						$('#from-time').val($(this).children().eq(2).text());
					} else {
						setScheduleInput(new Date());
					}
		    	}).leanModal({
		    	    top: 50,                     // #modal-windowの縦位置
		    	    overlay : 0.7,               // #modal-windowの背面の透明度
		    	    closeButton: ".modal_close"  // #modal-windowを閉じるボタンのdivのclass
		    	})
		    	removeLoading();
		    },
		    function(e){
		    	removeLoading();
		    });
			// 日付時間のﾌﾟﾗｸﾞｲﾝ設定
			setScheduleInput(new Date());

			// 登録ﾎﾞﾀﾝのｲﾍﾞﾝﾄ設定
			$('.square_btn').on('click',function(){
				// ｾｯｼｮﾝの生存確認
				sessionAlive();
				_date = $('.txt-date').val().split(' / ').join('');
		        _time = $('.txt-time').val().split(' : ').join('');
		        _beforedate = $('.beforedate').val().split(' / ').join('');
		        _beforetime = $('.beforetime').val().split(' : ').join('');
		        dispLoading();
				// ajaxでｻｰﾊﾞのﾌﾟﾚｲﾔｰ作成処理をｺｰﾙ
				$.ajax({
			        type: 'post',
			        url: '../php/schedule.php',
			        data: {
			        	date :_date,
			        	time :_time,
			        	beforedate :_beforedate,
			        	beforetime :_beforetime,
			        	title :$('.txt-title').val(),
			        	remarks :$('.txt-remarks').val(),
			        	status :($('.scheduleno').val() == 0) ? CREATE : UPDATE
			        }
			    }).then(function( ret ){
			    	// ﾛｸﾞｲﾝ成功時は画面遷移
			    	window.location.href = ret;
			    },
			    function(e){
			    	removeLoading();
			    });
			});
			// 削除ﾎﾞﾀﾝのｲﾍﾞﾝﾄ設定
			$('.delete_btn').on('click',function(){
				// ｾｯｼｮﾝの生存確認
				sessionAlive();
				_date = $('.txt-date').val().split(' / ').join('');
				_time = $('.txt-time').val().split(' : ').join('');
				_beforedate = $('.beforedate').val().split(' / ').join('');
		        _beforetime = $('.beforetime').val().split(' : ').join('');
		        dispLoading();
				// ajaxでｻｰﾊﾞのﾛｸﾞｲﾝ処理をｺｰﾙ
				$.ajax({
			        type: 'post',
			        url: '../php/schedule.php',
			        data: {
			        	date :_date,
			        	time :_time,
			        	beforedate :_beforedate,
			        	beforetime :_beforetime,
			        	title :$('.txt-title').val(),
			        	remarks :$('.txt-remarks').val(),
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
			setScroll($("table"));
		});