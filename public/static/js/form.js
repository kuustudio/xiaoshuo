//登录
$(function(){
    jQuery.validator.addMethod("isUserName", function(value, element) {
        var mobile = /^[1][0-9]{10}$/;
        var email = /^([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{1,3}$/;
        return this.optional(element) || (mobile.test(value) || email.test(value));
    }, "手机号或邮箱不合法");
    jQuery.validator.addMethod("isMobile", function(value, element) {
        var mobile = /^[1][0-9]{10}$/;
        return this.optional(element) || mobile.test(value);
    }, "请输入手机号码");

    jQuery.validator.addMethod("isPassword", function(value, element) {
        var password = /^[A-Za-z0-9]{6,16}$/;
        return this.optional(element) || password.test(value);
    }, "密码长度为6~16位，只能由a-z不限大小写英文字母或0-9的数字组成");
	
    $("#J_LoginForm").validate({
        rules: {
            username:{
                required: true,
                isUserName: true
            },
            password: {
                required: true,
                isPassword: true
            }
        },
        messages:{
            username: {
                required: "请填写手机号或邮箱"
            },
            password: {
                required: "请填写密码"
            }
        },
        submitHandler: function(form) {
            if(window.geetestCaptchaObj) {
                window.geetestCaptchaObj.verify();
                return;
            }else {
                //todo window.geetestCaptchaObj为空的情况
            }
        }
    });

    function login_onSuccess(captchaObj) {
        captchaObj.onSuccess(function () {
            var formParam = $("#J_LoginForm").serialize();//序列化表格内容为字符串
            var url = $("#J_LoginForm").attr('action');
            // console.log(url);
            // console.log(window.geetestCaptchaObj.onSuccess);
            $.ajax({
                type:'post',
                url:url,
                data:formParam,
                cache:false,
                complete: function() {
                    setTimeout(function() {
                        window.geetestCaptchaObj.reset();
                    },1000);
                },
                success:function(data){
                    var cnt = data.tip;
                    if(data.code == 100000){
                        SD.util.alert(cnt,3);
                        setTimeout(function(){
                            location.href = data.data.url;
                        },1000);
                    }else{
                        SD.util.alert(cnt);
                    }
                },
                error:function(e){
                    var cnt = '请求失败，请稍后重试';
                    SD.util.alert(cnt);
                }
            });
        });
    }
    window.login_onSuccess=login_onSuccess;


    //注册

    $("#J_RegisterForm").validate({
        onkeyup: false,
        rules: {
            username:{
                required: true,
                isUserName: true,
                remote : {url:SD.config.rootPath+"signup/checkUserName"}
            },
            password: {
                required: true,
                isPassword: true
            },
            'receive-code': {
                required: true,
                rangelength: [4,4],
                remote : {
                    url:SD.config.rootPath+"signup/checkVerCode",
                    data:{'to':function() {return $("#J_RegisterForm .username").val();},'ver_code':function() {return $("#J_RegisterForm .receive-code").val();}}
                }
            },
            'password-confirm': {
                required: true,
                equalTo: '.password'
            },
            nickname: {
                required: true,
                remote : {
                    url:SD.config.rootPath+"signup/checkReaderName"
                }
            }
        },
        messages:{
            username: {
                required: "请填写手机号或邮箱地址",
                remote: "手机号或邮箱被占用"
            },
            password: {
                required: "请填写密码"
            },
            'password-confirm': {
                required: "请填写密码",
                equalTo: "两次填写的密码不正确"
            },
            'receive-code': {
                required: "请填写验证码",
                rangelength: '验证码长度为4位',
                remote: '验证码不正确'
            },
            nickname: {
                required: "请输入昵称",
                remote: '昵称已被占用'
            }       
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
            // element.parent().find(".wrongBox").hide();
        },
        success: function(label) {
        },
        submitHandler: function() {
            var self = $(this);
            if(self.prop('disabled')) return false;

            var formParam = $("#J_RegisterForm").serialize();//序列化表格内容为字符串
            var url = $("#J_RegisterForm").attr('action');
            // console.log(url);
            $.ajax({
                type:'post',
                url:url,
                data:formParam,
                cache:false,
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                },
                success:function(data){
                    var cnt = data.tip;
                    if(data.code == 100000){
                        SD.util.alert(cnt,3);
                        setTimeout(function(){
                            location.href = data.data.url;
                        },1000);
                    }else{
			            SD.util.alert(cnt);
                    }
                },
                error:function(e){
                    var cnt = '请求失败，请稍后重试';
		            SD.util.alert(cnt);
                }
            });
        }
    });

    //忘记密码，修改密码
    $("#J_ModifyPassForm").validate({
        onkeyup: false,
        rules: {
            username:{
                required: true,
                isUserName: true,
                remote : {url:SD.config.rootPath+"signup/checkUserNameNotExist"}
            },
            password: {
                required: true,
                isPassword: true
            },
            'receive-code': {
                required: true,
                rangelength: [4,4],
                remote : {
                    url:SD.config.rootPath+"signup/checkVerCode",
                    data:{'to':function() {return $("#J_ModifyPassForm .username").val();},'ver_code':function() {return $("#J_ModifyPassForm .receive-code").val();}}
                }
            },
            'password-confirm': {
                required: true,
                equalTo: '.password'
            }
        },
        messages:{
            username: {
                required: "请填写绑定手机或邮箱",
                remote: "此邮箱或手机未注册"
            },
            password: {
                required: "请填写密码"
            },
            'password-confirm': {
                required: "请填写密码",
                equalTo: "两次填写的密码不正确"
            },
            'receive-code': {
                required: "请填写短信或者邮箱验证码",
                rangelength: '验证码长度为4位',
                remote: '验证码不正确'
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
            // element.parent().find(".wrongBox").hide();
        },
        success: function(label) {
        },
        submitHandler: function() {
            var self = $(this);
            if(self.prop('disabled')) return false;

            var formParam = $("#J_ModifyPassForm").serialize();//序列化表格内容为字符串
            var url = $("#J_ModifyPassForm").attr('action');
            // console.log(url);
            $.ajax({
                type:'post',
                url:url,
                data:formParam,
                cache:false,
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                },
                success:function(data){
                    var cnt = '修改成功';
                    if(data.code == 100000){
                        SD.util.alert(cnt,3);
                        setTimeout(function(){
                            location.href = data.data.url;
                        },1000);
                    }else{
                        SD.util.alert(cnt);
                    }
                },
                error:function(e){
                    var cnt = '请求失败，请稍后重试';
                    SD.util.alert(cnt);
                }
            });
        }
    });

    //更换手机
    var modifyMobileValidator = $("#J_ModifyMobileForm").validate({
        onkeyup: false,
        rules: {
            mobile:{
                required: true,
                isMobile: true,
                remote : {url:SD.config.rootPath+"signup/checkPhoneNum"}
            },
            password: {
                required: true
            },
            code: {
                required: true,
                rangelength: [4,4],
                remote : {url:SD.config.rootPath+"signup/checkVerify"}
            },
            'receive-code-mobile': {
                required: true,
                rangelength: [4,4],
                remote : {
                    url:SD.config.rootPath+"signup/checkVerCode",
                    data:{'to':function() {return $("#J_ModifyMobileForm .mobile").val();},'ver_code':function() {return $("#J_ModifyMobileForm .receive-code-mobile").val();},'type':1}
                }
            }
        },
        messages:{
            mobile: {
                required: "请填写手机号码",
                isMobile: "手机号格式不对",
                remote: "此手机号被占用"
            },
            password: {
                required: "请填写密码"
            },
            code: {
                required: "请填写图片验证码",
                rangelength: '图片码长度为4位',
                remote: '验证码不正确'
            },
            'receive-code-mobile': {
                required: "请填写短信验证码",
                rangelength: '短信验证码长度为4位',
                remote: '验证码不正确'
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
            element.parent().find(".wrongBox").hide();
        },
        success: function(label) {
        },
        submitHandler: function() {
            var formParam = $("#J_ModifyMobileForm").serialize();
            var url = $("#J_ModifyMobileForm").attr('action');
            $.ajax({
                type:'post',
                url:url,
                data:formParam,
                cache:false,
                success:function(data){
                    if(data.code == 100000){
                        var cnt = '<div class="dialog-tip">更换手机成功!</div>';
                        var dl = new dialog({title: ' ', fixed: true, content: cnt}).showModal();
                        setTimeout(function(){
                            dl.close();
                            location.href = SD.config.rootPath+"reader/my_info";
                        },1000);
                    }else{
                        var cnt = data.tip;
                        SD.util.alert(cnt);
                    }
                },
                error:function(e){
                    var cnt = '请求失败，请稍后重试';
                    SD.util.alert(cnt);
                }
            });
        }
    });

    //获取手机验证码
    $("#J_GetReceiveCode").click(function() {
        var self = $(this);
		if(self.prop('disabled')) return false;
		var post_data = {};
		if(window.geetestCaptchaObj) {
            if ($(".form-box").validate().element('.username')) {
                window.geetestCaptchaObj.verify();
            }else {
                console.log('验证失败');
            }
			return;
		}else {
		    //todo window.geetestCaptchaObj为空的情况
        }
    });
    function send_code_onSuccess(captchaObj) {
        var self = $("#J_GetReceiveCode");
        captchaObj.onSuccess(function () {
            var username = $(".form-box .username").val();
            var verify_type = $("#verify_type").val();
            post_data = {'username':username,'verify_type':verify_type};
            var validateDict = window.geetestCaptchaObj.getValidate();
            for(var key in validateDict) {
                post_data[key] = validateDict[key];
            }
            if ($(".form-box").validate().element('.username')) {
                $.ajax({
                    url: SD.config.rootPath+'signup/send_verify_code',
                    data: post_data,
                    beforeSend: function() {
                        //$("#J_GetReceiveCode").prop('disabled', true);
                        self.prop('disabled', true);
                    },
                    complete: function() {

                    },
                    success: function(res) {
                        if (res.code == 100000) {
                            self.find("span").hide();
                            var $time = self.find(".J_Timer");

                            $time.show();
                            var t = p = parseInt($time.find('i').text());
                            var timer = setInterval(function(){
                                $time.find('i').text(--t);
                                if (t==0) {
                                    clearInterval(timer);
                                    self.find("span").show();
                                    $time.hide().find('i').text(p);
                                    self.prop('disabled', false);
                                    if(window.geetestCaptchaObj) {
                                        window.geetestCaptchaObj.reset();
                                    }
                                }
                            }, 1000);
                        }else{
                            var cnt = res.tip;
                            SD.util.alert(cnt);
                            self.prop('disabled', false);
                        }
                    }
                });
            }else {
                console.log('验证失败');
            }
        });
    }
    window.send_code_onSuccess=send_code_onSuccess;

});