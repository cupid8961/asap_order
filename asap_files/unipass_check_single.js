$(function(){
	//$('#ntform01').submit(function(){ //2022-09-02 폼전송으로 ajax를 호출 하는 방식은 기존 데이터 처리와 중복될 위험이 매우 높아 버튼 클릭시 ajax호출 방식으로 변경
	$('#unipassCheckSingle').unbind('click').click(function(){
		if($('#gr_name').val() == ''){
			//alert('이름을 입력하세요.');
			$('#gr_name').focus();
			return false;
		}
		
		if($('#gr_unipass_no').val() == ''){
			//alert('개인통관부호를 입력하세요.');
			$('#gr_unipass_no').focus();
			return false;
		}

		if($('#gr_tel').val() == ''){
			//alert('연락처를 입력하세요.');
			$('#gr_tel').focus();
			return false;
		}
		
		//개인통관번호 수정  2024-02-27
		var gr_name = $('#gr_name').val();
		var gr_unipass_no = $('#gr_unipass_no').val();
		var gr_tel = $('#gr_tel').val();
		
		$('#gr_name2').val(gr_name);
		$('#gr_unipass_no2').val(gr_unipass_no);
		$('#gr_tel2').val(gr_tel);
		
		var options = {
	        url: '/elpisbbs/ajax.unipass_singlecheck.php',
	        beforeSubmit: function(){
	            $('.loading').show();
	        }, 
	        data: $('#ntform0111').serialize(), 
	        type: 'post', 
	        dataType: 'text', 
	        success:function(res){
				
				$('#checkResult > ul').append('<li>' + $('#gr_name').val() + ' / ' + $('#gr_unipass_no').val() + ' : <b class="success">' + res +'</b></li>'); //2022-04-18
				
				
				//$('#gr_name').val('');
				//$('#gr_unipass_no').val('');
				//$('#telno').val('');
				$('.loading').hide();
	        }, 
	        error: function(error){
	            alert('개인통관부호 검증에 실패 했습니다.');
				$('.loading').hide();
	        }
	    }

		$('#ntform0111').ajaxSubmit(options);
	
		return false;
	});
});