/**
 * 一些操作方法集合 mon(qq:505038730) 2014-9-30
 */
(function(root, factory ) {
    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.methods = factory( jQuery );
    }
}(this, function( $ ) {

        /*匹配出字符串的数字*/
        function returnInt(str){
        	return str.match(/\d+/g);
        }

        /* loading效果 */
        function loadingStart(){
            var top = $(window).height()/2 - 25;
            var left = $(window).width()/2 - 25;
            var tpl = '<div class="back-layer bg-layer"><div class="loading" style="top:'+ top +'px;left:'+ left +'px;">'
                     +'<img src="imgs/729.GIF">'
                     +'</div></div>';
            $(tpl).appendTo('body');

        }

        /* loading效果 */
        function loadingEnd(){
            $(".bg-layer").remove();
        }

        /* 返回顶部 */
        function toTop(){

            $backToTopEle = $('<div class="toTop" style="position:fixed; bottom:10px; right:5px; z-index:999; width:34px; height:35px;"><img src="./imgs/toTop.png" width=34px height=35px></div>').appendTo($("body")).click(function() {
                $("html, body").animate({ scrollTop: 0 }, 200);
            });

            $backToTopFun = function() {
                var st = $(document).scrollTop(), winh = $(window).height();
                (st > 0)? $backToTopEle.show(): $backToTopEle.hide();
            };

            $(window).bind("scroll", $backToTopFun);
            $(function() { $backToTopFun(); });
        }

        /*提取连接参数*/
        function getUrlParam(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
            var r = window.location.search.substr(1).match(reg);  
            var result = "";
            if (r!=null){
                result = unescape(r[2]);
            }
            return result;
        }

        /*替换电话4-8位*/
        function replaceTel(str){
           return str.replace(str.slice(3,7), "****")
        }

        /*判断手机号*/
        function verifyPhone(str) {
            var reg = /^(\+86)|(86)?1[3,5,8]{1}[0-9]{1}[0-9]{8}$/;
            if( reg.test(str)) {
            return true;
            } else {
            //alert("请确认手机号是否正确");
            }
        }

        function verifyEmail(str){ 
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; 
            if( reg.test(str)) {
            return true;
            } else {
            //alert("请确认email是否正确");
            }
        } 

        /*判断邮编*/
        function verifyPost(str) {
            var reg = /^[1-9][0-9]{5}$/;
            if( reg.test(str)) {
            return true;
            }else {
            //alert("请确认邮编是否正确");
            }
        }

        /*判断姓名长度*/
        function verifyName(str) {
            var len = str.length;
            if( len <= 10) {
            return true;
            }else {
            //alert("名字不能超过10个字符");
            }
        }

        /*判断身份证*/
        function isIdCardNo(idCardNo){
            //15位和18位身份证号码的基本校验
            var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
            if(!check) return false;
            //判断长度为15位或18位  
            if(idCardNo.length==15){
                return idCardNoUtil.check15IdCardNo(idCardNo);
            }else if(idCardNo.length==18){
                return idCardNoUtil.check18IdCardNo(idCardNo);
            }else{
                return false;
            }
        }

        /*字符串拼加,相加*/
        function strJoin(str,n){
         return (new Array(n+1)).join(str)
        }

        /*模拟alert框，有cb就执行cb*/
        function alert(text,cb){
            var tpl = '<div class="back-layer-alert alert-box"><div class="alertBox" style="width:300px;min-height:100px;position:fixed;top:50%;left:50%;margin:-50px 0 0 -150px;z-index:20005;box-shadow:1px 1px 3px rgba(0,0,0,.1);background:#fff;border:1px solid #ccc;color:#333;border-radius:5px"><div class="modal-body" style="padding:15px;word-break: break-all;font-size: 15px;">'+ text +'</div><div style="padding:14px 15px 10px;text-align:center;background-color:#f5f5f5;border-top:1px solid #ddd;-webkit-border-radius:0 0 6px 6px"><a class="btn btn-primary closeAlertBox" href="javascript:;" style="color:#fff">确定</a></div></div></div>';
           $(tpl).appendTo('body');

           $('.alert-box').delegate('.closeAlertBox', 'click', function() {
               $(".alert-box").remove();
               if (cb && typeof(cb) === 'function') {
                 cb()
               }
           });

            
        }

        /*模拟comfirm框，有cb就执行cb*/
        function comfirm(text,cbOk,cbNo){
            var tpl = '<div class="back-layer-comfirm comfirm-box"><div class="comfirmBox" style="width:300px;min-height:100px;position:fixed;top:50%;left:50%;margin:-50px 0 0 -150px;z-index:20005;box-shadow:1px 1px 3px rgba(0,0,0,.1);background:#fff;border:1px solid #ccc;color:#333;border-radius:5px"><div class="modal-body" style="padding:15px;word-break: break-all;font-size: 15px;">'+ text +'</div><div style="padding:14px 15px 10px;text-align:center;background-color:#f5f5f5;border-top:1px solid #ddd;-webkit-border-radius:0 0 6px 6px"><a class="btn cancelComfirmBox" href="javascript:;" style="margin-right:10px">取消</a><a class="btn btn-primary closeComfirmBox" href="javascript:;">确定</a></div></div></div>';
           $(tpl).appendTo('body');

           $('.comfirm-box').delegate('.closeComfirmBox', 'click', function() {
               $(".comfirm-box").remove();
               if (cbOk && typeof(cbOk) === 'function') {
                 cbOk()
               }
           })

           $('.comfirm-box').delegate('.cancelComfirmBox','click',function(){
                $(".comfirm-box").remove();
                if (cbNo && typeof(cbNo) === 'function') {
                 cbNo()
               }
           })

            
        }

        /*模拟comfirm框input输入框，有cb就执行cb*/
        function inputComfirm(title,text,cbOk,cbNo){
            var mb = title == "" ? '':'margin-bottom: 10px;';
            var tpl = '<div class="back-layer-comfirm inputComfirm-box"><div class="inputComfirmBox" style="width:300px;min-height:100px;position:fixed;top:50%;left:50%;margin:-50px 0 0 -150px;z-index:20005;box-shadow:1px 1px 3px rgba(0,0,0,.1);background:#fff;border:1px solid #ccc;color:#333;border-radius:5px"><div class="modal-body" style="padding:15px;word-break: break-all;font-size: 15px;"><h4 style="text-align: center;font-size: 1rem;color: #777;font-weight: normal;'+ mb +'">'+ title +'</h4><input type="text" class="inputComfirm" value="'+text+'" style="width:100%" placeholder=""></div><div style="padding:14px 15px 10px;text-align:center;background-color:#f5f5f5;border-top:1px solid #ddd;-webkit-border-radius:0 0 6px 6px"><a class="btn cancelInputComfirmBox" href="javascript:;" style="margin-right:10px">取消</a><a class="btn btn-primary closeInputComfirmBox" href="javascript:;">确定</a></div></div></div>';
           $(tpl).appendTo('body');

           $('.inputComfirm-box').delegate('.closeInputComfirmBox', 'click', function() {
               var inputVal = $('.inputComfirm').val();
               $(".inputComfirm-box").remove();
               if (cbOk && typeof(cbOk) === 'function') {
                 cbOk.call(this,inputVal,title)
               }

           })

           $('.inputComfirm-box').delegate('.cancelInputComfirmBox','click',function(){
                $(".inputComfirm-box").remove();
                if (cbNo && typeof(cbNo) === 'function') {
                 cbNo()
               }
           })

            
        }


        /*提示框,7个字以内*/
        function tipsBox(text){

              var tpl = '<div class="tipsBox" style="width:100px;min-height:20px;position:fixed;top:50%;left:50%;margin:-10px 0 0 -50px;z-index: 20005!important;background:rgba(0,0,0,.6);color:#fff;padding:3px 4px;border-radius:4px;font-size:13px;text-align:center;overflow:hidden;display:none;">'+ text +'</div>';
             $(tpl).appendTo('body').fadeIn();

             function tipsClose(){
               $(".tipsBox").fadeOut(function() {
                   $(this).remove();
               })
             }

             setTimeout(tipsClose,1200)

       }

        /*时间戳转时间*/
        function convertDate(str,hasMS){
            var hm = "";
            var date = new Date(str);
            Y = date.getFullYear() + '-';
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() < 10 ? '0'+ date.getHours() + ':' : date.getHours() + ':';
            m = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();// + ':';
            s = date.getSeconds(); 
            hm = hasMS ? h + m : "";
            return Y+M+D+hm //Y+M+D+h+m+s
        }

        /*获取验证码*/
        function getVerifyCode(){
            var getBtn = $('.getVerifyCode'),
                sys_second = 60;
    
            var timer = setInterval(function(){
            if (sys_second > 1) {
                sys_second -= 1;
                
                getBtn.html('<b class="second" style="color: #fff;">'+ sys_second +'s 重新获取</b>');
                getBtn.removeClass('getVerifyCode').addClass('disabled');
            } else { 
                clearInterval(timer);
                getBtn.removeClass('disabled').addClass('getVerifyCode');
                getBtn.text('获取验证码')
                $(document).delegate('.getVerifyCode', 'click', function(event) {
                    getVerifyCode();
                });
            }
          }, 1000); 
        }

        /*匹配筛选tel*/
         function matchTel(str,reg){
            var pos = "",
                len = reg.length;
            if (str.search(new RegExp(reg)) != -1) {
                //console.log(len)
                pos = str.search(new RegExp(reg));//匹配为第几个位置
                if(pos == 0){//首位
                    //console.log(len)
                   return "<b>" + str.substr(0,len) + "</b>" + str.substring(len) 
                } else if (pos == 7){//末尾
                    //console.log(pos)
                    return str.substring(0, pos) + "<b>" + str.substr(pos,len) + "</b>"
                } else {
                    //console.log(str.substring(pos+len))
                    return str.substring(0, pos) + "<b>" + str.substr(pos,len) + "</b>" + str.substring(pos+len)
                }
                
            } else {
                return str
            }
            
         }


         /*去链接的参数值*/
         function getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURIComponent(r[2]); return null;
         }

    
            /*0点过期*/
            /*function oneDayOutdate(n){
                var date=new Date();
                date.setDate( date.getDate()+1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                document.cookie="date_cookie;expires=" + date.toGMTString();
            }*/
            function oneDayOutdate(name,value){
                  var date = new Date();
                  date.setDate(date.getDate()+1);
                  date.setHours(0);
                  date.setMinutes(0);
                  date.setSeconds(0);
                  document.cookie = name + "=" + escape(value) + ";expires=" + date.toGMTString();
            }

            function getCookie(name) {
                    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

                    if(arr=document.cookie.match(reg)) 
                    return decodeURIComponent(arr[2]);

                    else return null;
                
            }
			
      			function addCookie(objName,objValue,objHours){//添加cookie
            				var str = objName + "=" + escape(objValue);
            				if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
            				var date = new Date();
            				var ms = objHours*3600*1000;
            				date.setTime(date.getTime() + ms);
            				str += "; expires=" + date.toGMTString();
            				}
            				document.cookie = str;
            				//alert("添加cookie成功");
      			}

            //比较日期大小，a为开始，b为结束
            function compareDate(a,b){

                  var dateA = Date.parse(a.replace(/-/g, "/")).valueOf();
                  var dateB = Date.parse(b.replace(/-/g, "/")).valueOf();

                  if (dateA > dateB) {

                      //fun.alert('结束时间不能小于开始时间');
                      return false;

                  } else {

                    return true;
                  }


            }

            //延迟执行
            function delay(func, wait) {

                var args = [].slice.call(arguments, 2);

                return setTimeout(function() {

                    return func.call(null, args);

                }, wait);

            }



    return{

        returnInt : returnInt,
        loadingStart : loadingStart,
        loadingEnd : loadingEnd,
        toTop : toTop,
        getUrlParam : getUrlParam,
        replaceTel : replaceTel,
        verifyPhone : verifyPhone,
        verifyEmail : verifyEmail,
        verifyPost : verifyPost,
        verifyName : verifyName,
        strJoin : strJoin,
        alert : alert,
        comfirm : comfirm,
        tipsBox : tipsBox,
        inputComfirm : inputComfirm,
        convertDate : convertDate,
        getVerifyCode : getVerifyCode,
        isIdCardNo : isIdCardNo,
        matchTel : matchTel,
        getQueryString : getQueryString,
        oneDayOutdate : oneDayOutdate,
        getCookie : getCookie,
		    addCookie:addCookie,
        compareDate : compareDate,
        delay : delay

    }

}));
