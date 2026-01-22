// 전역 변수
var errmsg = "";
var errfld = null;

// 필드 검사
function check_field(fld, msg)
{
    if ((fld.value = trim(fld.value)) == "")
        error_field(fld, msg);
    else
        clear_field(fld);
    return;
}

// 필드 오류 표시
function error_field(fld, msg)
{
    if (msg != "")
        errmsg += msg + "\n";
    if (!errfld) errfld = fld;
    fld.style.background = "#BDDEF7";
}

// 필드를 깨끗하게
function clear_field(fld)
{
    fld.style.background = "#FFFFFF";
}

function trim(s)
{
    var t = "";
    var from_pos = to_pos = 0;

    for (i=0; i<s.length; i++)
    {
        if (s.charAt(i) == ' ')
            continue;
        else
        {
            from_pos = i;
            break;
        }
    }

    for (i=s.length; i>=0; i--)
    {
        if (s.charAt(i-1) == ' ')
            continue;
        else
        {
            to_pos = i;
            break;
        }
    }

    t = s.substring(from_pos, to_pos);
    //				alert(from_pos + ',' + to_pos + ',' + t+'.');
    return t;
}

// 자바스크립트로 PHP의 number_format 흉내를 냄
// 숫자에 , 를 출력
function number_format(data)
{

    var tmp = '';
    var number = '';
    var cutlen = 3;
    var comma = ',';
    var i;

    var sign = data.match(/^[\+\-]/);
    if(sign) {
        data = data.replace(/^[\+\-]/, "");
    }

    len = data.length;
    mod = (len % cutlen);
    k = cutlen - mod;
    for (i=0; i<data.length; i++)
    {
        number = number + data.charAt(i);

        if (i < data.length - 1)
        {
            k++;
            if ((k % cutlen) == 0)
            {
                number = number + comma;
                k = 0;
            }
        }
    }

    if(sign != null)
        number = sign+number;

    return number;
}

// 새 창
function popup_window(url, winname, opt)
{
    window.open(url, winname, opt);
}


// 폼메일 창
function popup_formmail(url)
{
    opt = 'scrollbars=yes,width=417,height=385,top=10,left=20';
    popup_window(url, "wformmail", opt);
}

// , 를 없앤다.
function no_comma(data)
{
    var tmp = '';
    var comma = ',';
    var i;

    for (i=0; i<data.length; i++)
    {
        if (data.charAt(i) != comma)
            tmp += data.charAt(i);
    }
    return tmp;
}

// 삭제 검사 확인
function del(href)
{
    if(confirm("한번 삭제한 자료는 복구할 방법이 없습니다.\n\n정말 삭제하시겠습니까?")) {
        var iev = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                iev = parseFloat(RegExp.$1);
        }

        // IE6 이하에서 한글깨짐 방지
        if (iev != -1 && iev < 7) {
            document.location.href = encodeURI(href);
        } else {
            document.location.href = href;
        }
    }
}

// 쿠키 입력
function set_cookie(name, value, expirehours, domain)
{
    var today = new Date();
    today.setTime(today.getTime() + (60*60*1000*expirehours));
    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + today.toGMTString() + ";";
    if (domain) {
        document.cookie += "domain=" + domain + ";";
    }
}

// 쿠키 얻음
function get_cookie(name)
{
    var find_sw = false;
    var start, end;
    var i = 0;

    for (i=0; i<= document.cookie.length; i++)
    {
        start = i;
        end = start + name.length;

        if(document.cookie.substring(start, end) == name)
        {
            find_sw = true
            break
        }
    }

    if (find_sw == true)
    {
        start = end + 1;
        end = document.cookie.indexOf(";", start);

        if(end < start)
            end = document.cookie.length;

        return unescape(document.cookie.substring(start, end));
    }
    return "";
}

// 쿠키 지움
function delete_cookie(name)
{
    var today = new Date();

    today.setTime(today.getTime() - 1);
    var value = get_cookie(name);
    if(value != "")
        document.cookie = name + "=" + value + "; path=/; expires=" + today.toGMTString();
}

var last_id = null;
function menu(id)
{
    if (id != last_id)
    {
        if (last_id != null)
            document.getElementById(last_id).style.display = "none";
        document.getElementById(id).style.display = "block";
        last_id = id;
    }
    else
    {
        document.getElementById(id).style.display = "none";
        last_id = null;
    }
}

function textarea_decrease(id, row)
{
    if (document.getElementById(id).rows - row > 0)
        document.getElementById(id).rows -= row;
}

function textarea_original(id, row)
{
    document.getElementById(id).rows = row;
}

function textarea_increase(id, row)
{
    document.getElementById(id).rows += row;
}

// 글숫자 검사
function check_byte(content, target)
{
    var i = 0;
    var cnt = 0;
    var ch = '';
    var cont = document.getElementById(content).value;

    for (i=0; i<cont.length; i++) {
        ch = cont.charAt(i);
        if (escape(ch).length > 4) {
            cnt += 2;
        } else {
            cnt += 1;
        }
    }
    // 숫자를 출력
    document.getElementById(target).innerHTML = cnt;

    return cnt;
}

// 브라우저에서 오브젝트의 왼쪽 좌표
function get_left_pos(obj)
{
    var parentObj = null;
    var clientObj = obj;
    //var left = obj.offsetLeft + document.body.clientLeft;
    var left = obj.offsetLeft;

    while((parentObj=clientObj.offsetParent) != null)
    {
        left = left + parentObj.offsetLeft;
        clientObj = parentObj;
    }

    return left;
}

// 브라우저에서 오브젝트의 상단 좌표
function get_top_pos(obj)
{
    var parentObj = null;
    var clientObj = obj;
    //var top = obj.offsetTop + document.body.clientTop;
    var top = obj.offsetTop;

    while((parentObj=clientObj.offsetParent) != null)
    {
        top = top + parentObj.offsetTop;
        clientObj = parentObj;
    }

    return top;
}

function flash_movie(src, ids, width, height, wmode)
{
    var wh = "";
    if (parseInt(width) && parseInt(height))
        wh = " width='"+width+"' height='"+height+"' ";
    return "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' "+wh+" id="+ids+"><param name=wmode value="+wmode+"><param name=movie value="+src+"><param name=quality value=high><embed src="+src+" quality=high wmode="+wmode+" type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?p1_prod_version=shockwaveflash' "+wh+"></embed></object>";
}

function obj_movie(src, ids, width, height, autostart)
{
    var wh = "";
    if (parseInt(width) && parseInt(height))
        wh = " width='"+width+"' height='"+height+"' ";
    if (!autostart) autostart = false;
    return "<embed src='"+src+"' "+wh+" autostart='"+autostart+"'></embed>";
}

function doc_write(cont)
{
    document.write(cont);
}

var win_password_lost = function(href) {
    window.open(href, "win_password_lost", "left=50, top=50, width=617, height=330, scrollbars=1");
}

$(document).ready(function(){
    $("#login_password_lost, #ol_password_lost").click(function(){
        win_password_lost(this.href);
        return false;
    });
});

/**
 * 포인트 창
 **/
var win_point = function(href) {
    var new_win = window.open(href, 'win_point', 'left=100,top=100,width=600, height=600, scrollbars=1');
    new_win.focus();
}

/**
 * 쪽지 창
 **/
var win_memo = function(href) {
    var new_win = window.open(href, 'win_memo', 'left=100,top=100,width=620,height=500,scrollbars=1');
    new_win.focus();
}

/**
 * 메일 창
 **/
var win_email = function(href) {
    var new_win = window.open(href, 'win_email', 'left=100,top=100,width=600,height=580,scrollbars=0');
    new_win.focus();
}

/**
 * 자기소개 창
 **/
var win_profile = function(href) {
    var new_win = window.open(href, 'win_profile', 'left=100,top=100,width=620,height=510,scrollbars=1');
    new_win.focus();
}

/**
 * 스크랩 창
 **/
var win_scrap = function(href) {
    var new_win = window.open(href, 'win_scrap', 'left=100,top=100,width=600,height=600,scrollbars=1');
    new_win.focus();
}

/**
 * 홈페이지 창
 **/
var win_homepage = function(href) {
    var new_win = window.open(href, 'win_homepage', '');
    new_win.focus();
}

/**
 * 우편번호 창
 **/
var win_zip = function(frm_name, frm_zip, frm_addr1, frm_addr2, frm_addr3, frm_jibeon) {
    if(typeof daum === 'undefined'){
        alert("다음 우편번호 postcode.v2.js 파일이 로드되지 않았습니다.");
        return false;
    }

    var zip_case = 2;   //0이면 레이어, 1이면 페이지에 끼워 넣기, 2이면 새창

    var complete_fn = function(data){
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        var fullAddr = ''; // 최종 주소 변수
        var extraAddr = ''; // 조합형 주소 변수

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            fullAddr = data.roadAddress;

        } else { // 사용자가 지번 주소를 선택했을 경우(J)
            fullAddr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
        if(data.userSelectedType === 'R'){
            //법정동명이 있을 경우 추가한다.
            if(data.bname !== ''){
                extraAddr += data.bname;
            }
            // 건물명이 있을 경우 추가한다.
            if(data.buildingName !== ''){
                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
            extraAddr = (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
        }

        // 우편번호와 주소 정보를 해당 필드에 넣고, 커서를 상세주소 필드로 이동한다.
        var of = document[frm_name];

        of[frm_zip].value = data.zonecode;

        of[frm_addr1].value = fullAddr;
        of[frm_addr3].value = extraAddr;

        if(of[frm_jibeon] !== undefined){
            of[frm_jibeon].value = data.userSelectedType;
        }

        of[frm_addr2].focus();
    };

    switch(zip_case) {
        case 1 :    //iframe을 이용하여 페이지에 끼워 넣기
            var daum_pape_id = 'daum_juso_page'+frm_zip,
                element_wrap = document.getElementById(daum_pape_id),
                currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            if (element_wrap == null) {
                element_wrap = document.createElement("div");
                element_wrap.setAttribute("id", daum_pape_id);
                element_wrap.style.cssText = 'display:none;border:1px solid;left:0;width:100%;height:300px;margin:5px 0;position:relative;-webkit-overflow-scrolling:touch;';
                element_wrap.innerHTML = '<img src="//i1.daumcdn.net/localimg/localimages/07/postcode/320/close.png" id="btnFoldWrap" style="cursor:pointer;position:absolute;right:0px;top:-21px;z-index:1" class="close_daum_juso" alt="접기 버튼">';
                jQuery('form[name="'+frm_name+'"]').find('input[name="'+frm_addr1+'"]').before(element_wrap);
                jQuery("#"+daum_pape_id).off("click", ".close_daum_juso").on("click", ".close_daum_juso", function(e){
                    e.preventDefault();
                    jQuery(this).parent().hide();
                });
            }

            new daum.Postcode({
                oncomplete: function(data) {
                    complete_fn(data);
                    // iframe을 넣은 element를 안보이게 한다.
                    element_wrap.style.display = 'none';
                    // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                    document.body.scrollTop = currentScroll;
                },
                // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분.
                // iframe을 넣은 element의 높이값을 조정한다.
                onresize : function(size) {
                    element_wrap.style.height = size.height + "px";
                },
                maxSuggestItems : g5_is_mobile ? 6 : 10,
                width : '100%',
                height : '100%'
            }).embed(element_wrap);

            // iframe을 넣은 element를 보이게 한다.
            element_wrap.style.display = 'block';
            break;
        case 2 :    //새창으로 띄우기
            new daum.Postcode({
                oncomplete: function(data) {
                    complete_fn(data);
                }
            }).open();
            break;
        default :   //iframe을 이용하여 레이어 띄우기
            var rayer_id = 'daum_juso_rayer'+frm_zip,
                element_layer = document.getElementById(rayer_id);
            if (element_layer == null) {
                element_layer = document.createElement("div");
                element_layer.setAttribute("id", rayer_id);
                element_layer.style.cssText = 'display:none;border:5px solid;position:fixed;width:300px;height:460px;left:50%;margin-left:-155px;top:50%;margin-top:-235px;overflow:hidden;-webkit-overflow-scrolling:touch;z-index:10000';
                element_layer.innerHTML = '<img src="//i1.daumcdn.net/localimg/localimages/07/postcode/320/close.png" id="btnCloseLayer" style="cursor:pointer;position:absolute;right:-3px;top:-3px;z-index:1" class="close_daum_juso" alt="닫기 버튼">';
                document.body.appendChild(element_layer);
                jQuery("#"+rayer_id).off("click", ".close_daum_juso").on("click", ".close_daum_juso", function(e){
                    e.preventDefault();
                    jQuery(this).parent().hide();
                });
            }

            new daum.Postcode({
                oncomplete: function(data) {
                    complete_fn(data);
                    // iframe을 넣은 element를 안보이게 한다.
                    element_layer.style.display = 'none';
                },
                maxSuggestItems : g5_is_mobile ? 6 : 10,
                width : '100%',
                height : '100%'
            }).embed(element_layer);

            // iframe을 넣은 element를 보이게 한다.
            element_layer.style.display = 'block';
    }
}

/**
 * 새로운 비밀번호 분실 창 : 101123
 **/
win_password_lost = function(href)
{
    var new_win = window.open(href, 'win_password_lost', 'width=617, height=330, scrollbars=1');
    new_win.focus();
}

/**
 * 설문조사 결과
 **/
var win_poll = function(href) {
    var new_win = window.open(href, 'win_poll', 'width=616, height=500, scrollbars=1');
    new_win.focus();
}

/**
 * 스크린리더 미사용자를 위한 스크립트 - 지운아빠 2013-04-22
 * alt 값만 갖는 그래픽 링크에 마우스오버 시 title 값 부여, 마우스아웃 시 title 값 제거
 **/
$(function() {
    $('a img').mouseover(function() {
        $a_img_title = $(this).attr('alt');
        $(this).attr('title', $a_img_title);
    }).mouseout(function() {
        $(this).attr('title', '');
    });
});

/**
 * 텍스트 리사이즈
**/
function font_resize(id, rmv_class, add_class)
{
    var $el = $("#"+id);

    $el.removeClass(rmv_class).addClass(add_class);

    set_cookie("ck_font_resize_rmv_class", rmv_class, 1, g5_cookie_domain);
    set_cookie("ck_font_resize_add_class", add_class, 1, g5_cookie_domain);
}

/**
 * 댓글 수정 토큰
**/
function set_comment_token(f)
{
    if(typeof f.token === "undefined")
        $(f).prepend('<input type="hidden" name="token" value="">');

    $.ajax({
        url: g5_bbs_url+"/ajax.comment_token.php",
        type: "GET",
        dataType: "json",
        async: false,
        cache: false,
        success: function(data, textStatus) {
            f.token.value = data.token;
        }
    });
}

$(function(){
    $(".win_point").click(function() {
        win_point(this.href);
        return false;
    });

    $(".win_memo").click(function() {
        win_memo(this.href);
        return false;
    });

    $(".win_email").click(function() {
        win_email(this.href);
        return false;
    });

    $(".win_scrap").click(function() {
        win_scrap(this.href);
        return false;
    });

    $(".win_profile").click(function() {
        win_profile(this.href);
        return false;
    });

    $(".win_homepage").click(function() {
        win_homepage(this.href);
        return false;
    });

    $(".win_password_lost").click(function() {
        win_password_lost(this.href);
        return false;
    });

    /*
    $(".win_poll").click(function() {
        win_poll(this.href);
        return false;
    });
    */

    // 사이드뷰
    var sv_hide = false;
    $(".sv_member, .sv_guest").click(function() {
        $(".sv").removeClass("sv_on");
        $(this).closest(".sv_wrap").find(".sv").addClass("sv_on");
    });

    $(".sv, .sv_wrap").hover(
        function() {
            sv_hide = false;
        },
        function() {
            sv_hide = true;
        }
    );

    $(".sv_member, .sv_guest").focusin(function() {
        sv_hide = false;
        $(".sv").removeClass("sv_on");
        $(this).closest(".sv_wrap").find(".sv").addClass("sv_on");
    });

    $(".sv a").focusin(function() {
        sv_hide = false;
    });

    $(".sv a").focusout(function() {
        sv_hide = true;
    });

    // 셀렉트 ul
    var sel_hide = false;
    $('.sel_btn').click(function() {
        $('.sel_ul').removeClass('sel_on');
        $(this).siblings('.sel_ul').addClass('sel_on');
    });

    $(".sel_wrap").hover(
        function() {
            sel_hide = false;
        },
        function() {
            sel_hide = true;
        }
    );

    $('.sel_a').focusin(function() {
        sel_hide = false;
    });

    $('.sel_a').focusout(function() {
        sel_hide = true;
    });

    $(document).click(function() {
        if(sv_hide) { // 사이드뷰 해제
            $(".sv").removeClass("sv_on");
        }
        if (sel_hide) { // 셀렉트 ul 해제
            $('.sel_ul').removeClass('sel_on');
        }
    });

    $(document).focusin(function() {
        if(sv_hide) { // 사이드뷰 해제
            $(".sv").removeClass("sv_on");
        }
        if (sel_hide) { // 셀렉트 ul 해제
            $('.sel_ul').removeClass('sel_on');
        }
    });

    $(document).on( "keyup change", "textarea#wr_content[maxlength]", function(){
        var str = $(this).val();
        var mx = parseInt($(this).attr("maxlength"));
        if (str.length > mx) {
            $(this).val(str.substr(0, mx));
            return false;
        }
    });
});

function get_write_token(bo_table)
{
    var token = "";

    $.ajax({
        type: "POST",
        url: g5_bbs_url+"/write_token.php",
        data: { bo_table: bo_table },
        cache: false,
        async: false,
        dataType: "json",
        success: function(data) {
            if(data.error) {
                alert(data.error);
                if(data.url)
                    document.location.href = data.url;

                return false;
            }

            token = data.token;
        }
    });

    return token;
}

$(function() {
    $(document).on("click", "form[name=fwrite] input:submit, form[name=fwrite] button:submit, form[name=fwrite] input:image", function() {
        var f = this.form;

        if (typeof(f.bo_table) == "undefined") {
            return;
        }

        var bo_table = f.bo_table.value;
        var token = get_write_token(bo_table);

        if(!token) {
            alert("토큰 정보가 올바르지 않습니다.");
            return false;
        }

        var $f = $(f);

        if(typeof f.token === "undefined")
            $f.prepend('<input type="hidden" name="token" value="">');

        $f.find("input[name=token]").val(token);

        return true;
    });
});


///// 팝업 호출
function popup_open(popurl,popwidth,popheight){
	popleft = window.screenLeft+((document.body.clientWidth - popwidth) / 2); //팝업 창을 띄울 x 위치 지정(모니터 두 대를 합한 총 위치 기준)
	poptop = (screen.availHeight - popheight) * 0.5 - 40;			
	window.open(popurl,'','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width='+popwidth+',height='+popheight+',left='+popleft+',top='+poptop);  
}

function check_item_name(form){ /*영문과 숫자만*/
	var regType1 = /^[A-Za-z0-9\s\'\"\/\(\)\-\:\~\.\?\=\&\_\#\@\^\%\,]*$/;
	if (!regType1.test(form.value)) {     		
		form.value="";
	}		
}

function check_num_eng(form){ /*영문과 숫자만*/
	var regType1 = /^[A-Za-z0-9]*$/;
	if (!regType1.test(form.value)) {     		
		form.value="";
	}		
}

function check_num_dot(form){ /*숫자와 점만*/
	var regType2 = /^[0-9\.]*$/;
	if (!regType2.test(form.value)) {     		
		form.value="";
	}		
}

function check_num_comma(form){ /*숫자와 콤마만*/
	var regType2 = /^[0-9\,]*$/;
	if (!regType2.test(form.value)) {     		
		form.value="";
	}		
}

function check_num(form){ /*숫자만*/
	var regType3 = /^[0-9]*$/;
	if (!regType3.test(form.value)) {     		
		form.value="";
	}		
}

function check_no_korea(form){ /*한글금지*/
	var regType4 = /^[A-Za-z0-9]{1}[A-Za-z0-9\s\'\"\/\(\)\-\:\~\.\?\=\&\_\#\@\^\%\,\+]*$/;
	if (!regType4.test(form.value)) {     		
		form.value="";
	}		
}	

function check_num_hippen(form){ /*숫자와 -만*/
	var regType5 = /^[0-9\-]*$/;
	if (!regType5.test(form.value)) {     		
		form.value="";
	}		
}

function check_num_dot_hippen(form){ /*숫자와 점  -만 */
	var regType2 = /^[0-9\.\-]*$/;
	if (!regType2.test(form.value)) {     		
		form.value="";
	}		
}

function check_big_num(form){ /*0보다 큰수만*/
	var regType6 = /^[1-9]{1}[0-9]*$/;
	if (!regType6.test(form.value)) {     		
		form.value="";
	}		
}


//AJAX 검색을 위한 현재 클릭한 input 의 배열번호 구하기
function getIdx(obj,type)
{
	var topObj = $(type + "[name='"+obj.name+"']");
	for( var i=0;i<topObj.length;i++)
	{
		if( topObj[i] == obj )
			return i;
	}
}


//// 소수점 올림
function mathceil(val){
	var cost = Math.ceil(val);	
	return cost;
}

//// 소수점 버림
function mathfloor(val){
	var cost = Math.floor(val);	
	return cost;
}

//// 소수점 반올림
function mathround(val){
	var cost = Math.round(val);	
	return cost;
}

///// 숫자에 점찍기 : 화폐단위 표시
function comma(val){

	val = val*1;

    var len, point, str;       

    val = val + "";  
    point = val.length % 3 ;
    len = val.length;    

    str = val.substring(0, point);  

    while (point < len) {  
        if (str != "") str += ",";  
        str += val.substring(point, point + 3);  
        point += 3;  
    }  
    return str;

}


///// 숫자에서 점빼기 : 화폐단위 ㅈ거
function uncomma(val){
	var str = val.replace(/[^0-9]/g,'');
	return str;
}


//// 사이트 언어 변경
function sl_chage(country_code){
	//언어 설정세션 변경 호출
	location.replace('?country_code='+country_code);
}

//// 체크박스 전체 선택 해제
function checkbox_all(thisname,checkedname){	
	if($("input[name='"+thisname+"']").is(":checked")==true){ //전체 선택
		$("input[name='"+checkedname+"']").prop('checked',true);
	}else{ //전체 해제
		$("input[name='"+checkedname+"']").prop('checked',false);
	}
}


//// 다음주소 
function sample4_execDaumPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
			var extraRoadAddr = ''; // 도로명 조합형 주소 변수

			// 법정동명이 있을 경우 추가한다. (법정리는 제외)
			// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
			if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
				extraRoadAddr += data.bname;
			}
			// 건물명이 있고, 공동주택일 경우 추가한다.
			if(data.buildingName !== '' && data.apartment === 'Y'){
			   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			}
			// 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
			if(extraRoadAddr !== ''){
				extraRoadAddr = ' (' + extraRoadAddr + ')';
			}
			// 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
			if(fullRoadAddr !== ''){
				fullRoadAddr += extraRoadAddr;
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementById('sample4_postcode').value = data.zonecode; //5자리 새우편번호 사용
			document.getElementById('sample4_roadAddress').value = fullRoadAddr;
			document.getElementById('sample4_jibunAddress').value = data.jibunAddress;

			// 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
			if(data.autoRoadAddress) {
				//예상되는 도로명 주소에 조합형 주소를 추가한다.
				var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
				document.getElementById('guide').innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';

			} else if(data.autoJibunAddress) {
				var expJibunAddr = data.autoJibunAddress;
				document.getElementById('guide').innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';

			} else {
				document.getElementById('guide').innerHTML = '';
			}
		}
	}).open();
}



/// 주소 불러오기 주소,상세주소 형
function sample6_execDaumPostcode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var fullAddr = ''; // 최종 주소 변수
			var extraAddr = ''; // 조합형 주소 변수

			// 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				fullAddr = data.roadAddress;

			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				fullAddr = data.jibunAddress;
			}

			// 사용자가 선택한 주소가 도로명 타입일때 조합한다.
			if(data.userSelectedType === 'R'){
				//법정동명이 있을 경우 추가한다.
				if(data.bname !== ''){
					extraAddr += data.bname;
				}
				// 건물명이 있을 경우 추가한다.
				if(data.buildingName !== ''){
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
				}
				// 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
				fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.getElementById('sample6_postcode').value = data.zonecode; //5자리 새우편번호 사용
			document.getElementById('sample6_address').value = fullAddr;
			document.getElementById('sample6_address_eng').value = data.addressEnglish;

			// 커서를 상세주소 필드로 이동한다.
			document.getElementById('sample6_address2').focus();
		}
	}).open();
}


//// 뉴토스 체크박스 배열 [] 시 input 으로 hidden 값 사용 처리 스크립트
function this_check_value(obj,thisname,target){
	var idx = $("input[name='"+thisname+"']").index(obj); //배열번호
	var chkval = $("input[name='"+thisname+"']").eq(idx).val(); //체크박스의 값

	if($("input[name='"+thisname+"']").eq(idx).is(":checked")==true){ // 선택
		$("input[name='"+target+"']").eq(idx).val(chkval); //타겟의 값 변경 : 체크박스의 값
	}else{ // 해제
		$("input[name='"+target+"']").eq(idx).val(''); //타겟의 값 변경 : 널
	}	
}


//// 뉴토스 체크박스 배열 [] 시 input 으로 hidden 값 사용 처리 스크립트 : 아이디
function this_check_value_for_id(obj,thisname,target){

	var chkval = $("input[name='"+thisname+"']").val(); //체크박스의 값

	if($("input[name='"+thisname+"']").is(":checked")==true){ // 선택		
		$("#"+target).val(chkval); //타겟의 값 변경 : 체크박스의 값
	}else{ // 해제
		$("#"+target).val(''); //타겟의 값 변경 : 널
	}	
}

//// 뉴토스 체크박스 배열 [] 시 input 으로 hidden 값 사용 처리 스크립트 : 1개만 선택 모두 해제
function this_check_value_one(obj,thisname,target){	

	var idx = $("input[name='"+thisname+"']").index(obj); //배열번호
	var chkval = $("input[name='"+thisname+"']").eq(idx).val(); //체크박스의 값

	$("input[name='"+thisname+"']").prop('checked',false); //일단 모두 해제
	$("input[name='"+target+"']").val(''); ////타겟의 값도 모두 초기화

	$("input[name='"+thisname+"']").eq(idx).prop('checked',true); //선택

	if($("input[name='"+thisname+"']").eq(idx).is(":checked")==true){ // 선택		
		$("input[name='"+target+"']").eq(idx).val(chkval); //타겟의 값 변경 : 체크박스의 값
	}else{ // 해제
		$("input[name='"+target+"']").eq(idx).val(''); //타겟의 값 변경 : 널
	}
	
}


/// 부드럽케 아이디로 스크롤 위치 이동하기
function scroll_move(thisid){
	var scrollPosition = $("#"+thisid).offset().top;
	$('html, body').animate( { scrollTop : scrollPosition }, 400 );
}


//// 회원 아이디 검색 팝업
function member_search(targetname){
	popup_open('/elpisadm/member_search.php',800,600); //팝업오픈
}


//// 회원 아이디 검색 팝업 - 예치금전용
function member_deposit_search(targetname){
	popup_open('/elpisadm/member_deposit_search.php',800,600); //팝업오픈
}

//// 회원 아이디 검색 팝업 - 예치금전용 api 회원
function member_deposit_search_api(targetname){
	popup_open('/elpisadm/member_deposit_api_search.php',800,600); //팝업오픈
}


//// 바이트 수 계산
function textarea_check_byte(obj, maxByte, printid){

	var str = obj.value;
	var str_len = str.length;
	var rbyte = 0;
	var rlen = 0;
	var one_char = "";
	var str2 = "";

	for(var i=0; i<str_len; i++){
		one_char = str.charAt(i);
		if(escape(one_char).length > 4){
			rbyte += 2;   //한글2Byte
		}else{
			rbyte++;  //영문 등 나머지 1Byte
		}

		if(rbyte <= maxByte){
			rlen = i+1; //return할 문자열 갯수
		}
	}

	if(rbyte > maxByte){
		alert("한글 "+(maxByte/2)+"자 / 영문 "+maxByte+"자를 초과 입력할 수 없습니다.");
		str2 = str.substr(0,rlen);                                  //문자열 자르기
		obj.value = str2;
		fnChkByte(obj, maxByte);
	}else{
		document.getElementById(printid).innerText = rbyte;
	}

}

//// 바이트 수 계산 :: 경고없음
function textarea_check_byte_no_alert(obj, maxByte, printid){

	var str = obj.value;
	var str_len = str.length;
	var rbyte = 0;
	var rlen = 0;
	var one_char = "";
	var str2 = "";

	for(var i=0; i<str_len; i++){
		one_char = str.charAt(i);
		if(escape(one_char).length > 4){
			rbyte += 2;   //한글2Byte
		}else{
			rbyte++;  //영문 등 나머지 1Byte
		}

		if(rbyte <= maxByte){
			rlen = i+1; //return할 문자열 갯수
		}
	}

	if(rbyte > maxByte){
		$('#'+printid).css("color","red");
		document.getElementById(printid).innerText = rbyte;
	}else{
		$('#'+printid).css("color","blank");
		document.getElementById(printid).innerText = rbyte;
	}

}

// 숫자형 출력 : 소수점처리 : php common.lib.php 와 동일한 값을 출력하기 위한 스크립트 + 콤마
function money_print(cost,exchange){

	var point = 2;
	point = point*1;

	if(exchange=="KRW" || exchange=="JPY" || exchange=="VND"){
		point = 0;
	}

	if(point>0){	//소수점이 있는 화폐일때
		cost = cost*1; //수치화
		cost = cost.toFixed(point);
		costs = cost.split(".");
		cost3 = costs[0];
	}else{ //소수점이 없는 화폐일때
		cost3 = Math.ceil(cost); //소수점 올림처리 :: KRW는 원의 자리에서 올림하여 10원단위를 처리		
		//cost3 = Math.round(cost); //소수점 반올림
		/*
		Math.ceil() : 소수점 올림, 정수 반환
		Math.floor() : 소수점 버림, 정수 반환
		Math.round() : 소수점 반올림, 정수 반환
		*/
	}
	cost3 = String(cost3);
	var cost4="";
	j=1;
	for(i=cost3.length-1;i>=0;i--){
		cost4 = cost3.charAt(i) + cost4;
		if((i!=0)&&(j%3)==0) cost4 =","+cost4;
		j++;
	}
	if(point>0){cost4 = cost4+"."+costs[1]};	
	return cost4;	
}


// 숫자형 출력 : 소수점처리 : php common.lib.php 와 동일한 값을 출력하기 위한 스크립트
function money_cut(cost,exchange){

	var point = 2;
	point = point*1;

	if(exchange=="KRW" || exchange=="JPY" || exchange=="VND"){
		point = 0;
	}

	if(point>0){	//소수점이 있는 화폐일때
		cost = cost*1; //수치화
		cost = cost.toFixed(point);
		costs = cost.split(".");
		cost3 = costs[0];
	}else{ //소수점이 없는 화폐일때
		cost3 = Math.ceil(cost); //소수점 올림처리 :: KRW는 원의 자리에서 올림하여 10원단위를 처리		
		//cost3 = Math.round(cost); //소수점 반올림
		/*
		Math.ceil() : 소수점 올림, 정수 반환
		Math.floor() : 소수점 버림, 정수 반환
		Math.round() : 소수점 반올림, 정수 반환
		*/
	}
	cost3 = String(cost3);
	var cost4="";
	j=1;
	for(i=cost3.length-1;i>=0;i--){
		cost4 = cost3.charAt(i) + cost4;
		//if((i!=0)&&(j%3)==0) cost4 =","+cost4;
		j++;
	}
	if(point>0){cost4 = cost4+"."+costs[1]};	
	return cost4;	
}






