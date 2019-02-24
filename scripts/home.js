//**********************************************************
// home.js
//*********************************************************/
$(function(){
	// ajaxで取得処理をｺｰﾙ
	$.ajax({
        type: 'post',
        url: '../php/home.php',
        data: {
        }
    }).then(function( ret ){
    	var json = JSON.parse(ret);
    	var html = '';
    	var sch = '';
    	$.each(json,function(i,val){
    		var $t = val;

    		html = '<div>今年はまだ開催されていません</div>';

    		if($t.data.length) {
    			html = '<tr>';
        		html += '<td class="header">順位</td>';
        		html += '<td class="header">';
        		html += '名前';
        		html += '</td>';
        		html += '<td class="header">';
        		html += '累計';
        		html += '</td>';
        		html += '<td class="header">';
        		html += '差';
        		html += '</td>';
        		html += '</tr>';
			}

    		$.each($t.data,function(_i,_v){
    			html += '<tr>';
    			html += '<th>' + _v.rank  + '</th>';
    			html += '<td class="data-name">';
    			html +=	_v.name;
	            html += '</td>';
	            html += '<td class="data-total">';
	            html +=	_v.score;
	            html += '</td>';
	            html += '<td class="data-top-sub">';
	            html +=	_v.sub;
	            html += ' </td>';
	            html += '</tr>';
    		});

    		$.each($t.sch,function(_i,_v){
    			sch += '<span>次回開催日</span>&nbsp;&nbsp;';
    			sch += '<span class="home-sch">' + _v.date + '</span>&nbsp;&nbsp;';
    			sch += '<span class="home-sch">' + _v.time + '～</span>';
    		});
    	});
    	$('#tablearea').find('tbody').html(html);
    	$('.schedule').html(sch);
    },
    function(e){
    });

	$('.slider').slick({
		accessibility: true
	});
})