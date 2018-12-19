if (typeof String.prototype.trim === "undefined") {
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}



//修复IE在未F12开启调试工具的时候，console未定义的BUG
window.console = window.console || (function(){
        var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
            = c.clear = c.exception = c.trace = c.assert = function(){};
        return c;
    })();


/*
 * $.fn.hoverClass
 * $x.hoverClass("className") //默认为hover
 */
(function(a) {
    a.fn.hoverClass = function(b) {
        var a = this;
        b = b ? b : 'hover';
        a.each(function(c) {
            a.eq(c).hover(function() {
                $(this).addClass(b)
            }, function() {
                $(this).removeClass(b)
            })
        });
        return a
    };
})(jQuery);


jQuery.ajaxSetup({
    type: 'POST',
    dataType: 'json',
    cache: false,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        SD.util.alert('网络错误，请稍后重试！', 5);
    }
});

//网站主要功能
(function($,SD){

    $.extend(SD.config.jsAlias,{
        "autocomplete": SD.config.jsPath + '/third-parties/' + "autocomplete.js",
        "tab": SD.config.jsPath + '/third-parties/' + "tab.js",
        "placeholder": SD.config.jsPath + '/third-parties/' + "placeholder.js"
    });

    $(function(){

        if (typeof initResponse == 'function')
            window.onresize = initResponse;

        //图片延时加载
        $('img.lazyload').length && lazyloadHandle();
        //placeholder
        $('input[placeholder]').length && placeholder($('input[placeholder]'));
        //自动补全
        // $("input[name='keyword'][autocomplete='off']").length && autocompleteHandle($("input[name='keyword'][autocomplete='off']"));
        //切换
        $('.act-tab').length && tabSwitch($('.act-tab'));
        $('.act-tab-hover').length && tabSwitch($('.act-tab-hover'),{'handle':'mouseover'});

        $('.J_SimpleScroll').length && simpleScrollHandle($('.J_SimpleScroll'));
        // $('.J_mCustomScrollbar').length && mCustomScrollbar($('.J_mCustomScrollbar'));
        $('.J_mCustomScrollbar').length && nicescroll($('.J_mCustomScrollbar'));
    });

    function lazyloadHandle() {
        SD.util.require('jquery.lazyload', function(){
            // console.log($("img.lazyload"));
            $("img.lazyload").lazyload({
                threshold : 300,
                // effect : "fadeIn",
                // placeholder: "../images/transparent.png",
                failure_limit: 200,
                skip_invisible : false
            });
        });
    }
    // function placeholder(obj){
    //     SD.util.require('placeholder', function(){
    //         obj.each(function(){
    //             $(this).qfcplaceholder();
    //         });
    //     });
    // }

    function autocompleteHandle (obj) {
        SD.util.require('autocomplete', function(){
            obj.each(function(){
                var width=$(this).width();
                $(this).qfcac({
                    width:width,
                    url: SD.config.rootPath + 'index/get_search_keys',
                    submitMode: false,
                    left: 7
                });
            });
        });
    }
    function mCustomScrollbar (obj) {
        SD.util.require('jquery.mCustomScrollbar', function(){
            obj.each(function() {
                var option = $.extend({
                    theme:'dark'
                }, $(this).data(option));
                $(this).mCustomScrollbar(option);
            });
        });
    }
    function nicescroll (obj) {
        SD.util.require('jquery.nicescroll', function(){
            obj.each(function() {
                var option = $.extend({
                    cursorcolor: '#c8c8c8'
                }, $(this).data(option));
                $(this).niceScroll(option);
            });
        });
    }

    function tabSwitch(obj,opt){
        SD.util.require('tab', function(){
            obj.qfctab(opt?opt:{});
        });
    }

    //文字滚动
    function simpleScrollHandle(obj) {
        obj.each(function(){
            var _this = $(this);
            var len = $(this).find("li").length;
            var dataLen = _this.attr('data-length');

            if (len <= dataLen) return;

            var H = _this.find("li").first().outerHeight();

            var t = setInterval(function(){scroll(_this, H)}, 4000);

            _this.mouseenter(function(){
                clearInterval(t);
            }).mouseleave(function(){
                t = setInterval(function(){scroll(_this, H)}, 4000);
            });

        });

        function scroll(o,H) {
            o.animate({
                marginTop : '-'+H+'px'
            },500,function() {
                $('.J_SimpleScroll').css({marginTop : 0}).children("li:first").appendTo(this);
            });
        }
    }

})(jQuery,SD);

//时间
//author: meizz 
//var time1 = new Date().Format("yyyy-MM-dd");
//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss"); 
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

$(function(){

    //返回首页
    //goTop
    /*var goTop = function() {
    	var ww = $(window).outerWidth();
    	var gw = $("#J_GoTop").outerWidth();
    	if (ww > 1280 + gw) {
    		$('#J_GoTop').css({'right': 'auto','left': '50%','margin-left': '615px'})
    	} else if (ww > 990 + gw && ww <=1280 + gw) {
    		$('#J_GoTop').css({'margin-left': '510px'})
    	} else {
    		$('#J_GoTop').css({'right': 0, 'left': 'auto'})
    	}
    }
    goTop();*/

    if($('#J_MenuFixed').length) {
        var menuFixedPosition = $("#J_MenuFixed").position();
        var menuFixed = parseInt(menuFixedPosition.top)+parseInt($('#J_MenuFixed').outerHeight());
    }

    $(window).scroll(function() {

        if($('#J_MenuFixed').length) {

            if($(this).scrollTop()>menuFixed){
                $('#J_MenuFixed').addClass("menu-fixed");
            } else {
                $('#J_MenuFixed').removeClass("menu-fixed");
            }
        }

    });
    $("#J_GoTop").click(function(){
        $('html,body').animate({scrollTop:0},'slow');
        return false;
    });
    // $(window).resize(goTop);

    //小说详情
    $(".J_BookList .book-overlay-info").hoverClass();

    //粉丝弹框
    $(".J_FansTip li").hoverClass();

    //input-radio
    /*$(document).on('click', '.J_InputRadio a', function() {
        var self = $(this);
        var box = self.closest('.J_InputRadio');
        if (self.hasClass("selected")) return;
        box.find("a").removeClass("selected").find("input[type='radio']").attr('checked', false);
        self.addClass("selected").find("input[type='radio']").attr('checked', true);
    });*/

    //input-checkbox
    /*$(document).on('click', '.J_InputCheckbox a', function() {
        var self = $(this);
        if (self.hasClass("selected")){
            self.removeClass("selected").find("input[type='checkbox']").attr('checked', false);
        }else{
            self.addClass("selected").find("input[type='checkbox']").attr('checked', true);
        }
    });


    //排行榜
    $(".J_RankList").hover(function() {
        var $box = $(this).closest(".J_RankList");
        $box.find('ul').show();
    }, function() {
        var $box = $(this).closest(".J_RankList");
        $box.find('ul').hide();
    });
    $(".J_RankList ul a").click(function() {
        var $box = $(this).closest(".J_RankList");
        $($box.find('a')[0]).text($(this).text());
        var $list = $box.closest(".J_RecommList");
        if ($(this).hasClass("selected")) return;
        var index = $(this).parent("li").index();
        $box.find(".selected").removeClass("selected");
        $(this).addClass("selected");
        $($list.find('.tab').get(index)).show().siblings(".tab").hide();
        $box.find("ul").hide();
    });*/

    //评论 赞黑
    function commentOpt(type, id, self, sibling) {
        if (self.hasClass('done')) return;
        if (self.attr("disabled")) return;

        var url = {
            zanTsukkomi: 	'chapter/like_tsukkomi',
            heiTsukkomi: 	'chapter/unlike_tsukkomi',
            zanReview: 		'book/like_review',
            heiReview: 		'book/unlike_review',
            zanBbs:			'bbs/like_bbs',
            heiBbs:			'bbs/unlike_bbs',
            zanBbsComment:	'bbs/like_bbs_comment',
            heiBbsComment:	'bbs/unlike_bbs_comment'
        };
        var data = {};
        if (type == 'zanTsukkomi' || type == 'heiTsukkomi') {
            data.tsukkomi_id = id;
        } else if (type == 'zanReview' || type == 'heiReview') {
            data.review_id = id;
        }else if (type == 'zanBbs' || type == 'heiBbs') {
            data.bbs_id = id;
        }else if (type == 'zanBbsComment' || type == 'heiBbsComment') {
            data.comment_id = id;
        } else {
            return false;
        }

        $.ajax({
            url: SD.config.rootPath + url[type],
            data: data,
            beforeSend: function() {
                self.attr("disabled", true);
            },
            complete: function() {
                self.attr("disabled", false);
            },
            // error: function() {
            // 	var res = {};
            // 	res.code = 100000;
            // 	res.tip = 100000;
            // 	if (res.code == 100000) {
            // 		self.addClass("done").find('i').text(1+parseInt(self.find('i').text()));
            // 		if (sibling.hasClass('done')) {
            // 			sibling.removeClass('done').find('i').text(parseInt(sibling.find('i').text())-1);
            // 		}
            // 	} else {
            // 		SD.util.alert(res.tip);
            // 	}
            // },
            success: function(res) {
                if (res.code == 100000) {
                    self.addClass("done").find('i').text(1+parseInt(self.find('i').text()));
                    if (sibling.hasClass('done')) {
                        sibling.removeClass('done').find('i').text(parseInt(sibling.find('i').text())-1);
                    }
                } else {
                    SD.util.alert(res.tip);
                }
            }
        })
    }

    $(document).on("click", ".J_TsukkomiOpt .J_Zan", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_TsukkomiOpt");
        var sibling = parent.find(".J_Hei");
        var id = self.closest("li").attr('data-tsukkomi-id');

        commentOpt('zanTsukkomi', id, self, sibling);
    });
    $(document).on("click", ".J_TsukkomiOpt .J_Hei", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_TsukkomiOpt");
        var sibling = parent.find(".J_Zan");
        var id = self.closest("li").attr('data-tsukkomi-id');

        commentOpt('heiTsukkomi', id, self, sibling);
    });
    $(document).on("click", ".J_CommentOpt .J_Zan", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_CommentOpt");
        var sibling = parent.find(".J_Hei");
        var id = self.closest("li").attr('data-review-id');

        commentOpt('zanReview', id, self, sibling);
    });
    $(document).on("click", ".J_CommentOpt .J_Hei", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_CommentOpt");
        var sibling = parent.find(".J_Zan");
        var id = self.closest("li").attr('data-review-id');

        commentOpt('heiReview', id, self, sibling);
    });

    //论坛赞/黑
    $(document).on("click", ".J_bbsOpt .J_Zan", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_bbsOpt");
        var sibling = parent.find(".J_Hei");
        var id = self.closest("li").attr('data-bbs-id');

        commentOpt('zanBbs', id, self, sibling);
    });
    $(document).on("click", ".J_bbsOpt .J_Hei", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_bbsOpt");
        var sibling = parent.find(".J_Zan");
        var id = self.closest("li").attr('data-bbs-id');

        commentOpt('heiBbs', id, self, sibling);
    });

    //论坛评论的赞/黑
    $(document).on("click", ".J_bbsCommentOpt .J_Zan", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_bbsCommentOpt");
        var sibling = parent.find(".J_Hei");
        var id = self.closest("li").attr('data-comment-id');

        commentOpt('zanBbsComment', id, self, sibling);
    });
    $(document).on("click", ".J_bbsCommentOpt .J_Hei", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        var parent = self.closest(".J_bbsCommentOpt");
        var sibling = parent.find(".J_Zan");
        var id = self.closest("li").attr('data-comment-id');

        commentOpt('heiBbsComment', id, self, sibling);
    });

    //todo 关注、取消关注
    $(document).on("click", ".J_Follow", function() {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        if (self.prop("disabled")) return false;

        var curr_reader_id = self.attr('data-reader-id');

        //取消关注
        if (self.attr("data-follow")==1) {
            $.ajax({
                url: SD.config.rootPath + 'reader/unfollow',
                data: {reader_id:curr_reader_id},
                beforeSubmit: function() {
                    self.prop("disabled", true);
                },
                complete: function () {
                    self.prop("disabled", false);
                },
                // error: function () {
                // 	var res = {};
                // 	res.code = 100000;
                //     if (res.code == 100000) {
                //         var msg = res.tip ? res.tip : '取消关注成功！';
                //         SD.util.alert(msg,1);
                //         self.attr("data-follow", 0);
                //     	self.html("<i>&plus;</i> 关注");
                //     } else {
                //         SD.util.alert(res.tip,1);
                //     }
                // },
                success: function (res) {
                    if (res.code == 100000) {
                        var msg = res.tip ? res.tip : '取消关注成功！';
                        SD.util.alert(msg,1);
                        syncFollow(curr_reader_id, "+关注", 0);
                    } else {
                        SD.util.alert(res.tip,1);
                    }
                }
            });
        } else { //关注

            $.ajax({
                url: SD.config.rootPath + 'reader/follow',
                data: {reader_id:curr_reader_id},
                beforeSubmit: function() {
                    self.prop("disabled", true);
                },
                complete: function () {
                    self.prop("disabled", false);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        var msg = res.tip ? res.tip : '关注成功！';
                        SD.util.alert(msg,1);
                        syncFollow(curr_reader_id, "取关", 1);
                    } else {
                        SD.util.alert(res.tip,1);
                    }
                }
            });
        }

        function syncFollow(id, html, follow_type) {
            if (follow_type==1){//关注成功
                $(document).find(".J_Follow[data-reader-id='"+id+"']").html(html).attr("data-follow", follow_type).removeClass('btn-light-pink');
            }else {//取消关注成功
                $(document).find(".J_Follow[data-reader-id='"+id+"']").html(html).attr("data-follow", follow_type).addClass('btn-light-pink');
            }
        }
    });

    //收藏
    $(document).on("click", ".J_Favor", function(event) {
        if (SD.userinfo.reader_id==0) {
            SD.util.loginDialog();
            return;
        }
        var self = $(this);
        if(self.prop('disabled')) return false;

        var book_id = self.attr('data-book-id');
        if (self.attr('data-favor')==1) {

            $.ajax({
                url: SD.config.rootPath + 'bookshelf/delete_shelf_book',
                data: {book_id: book_id},
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        self.attr('data-favor',0);
                        self.removeClass('favored');
                        self.find('.J_FavorText').html('放入书架');
                    }
                    SD.util.alert(res.tip,1);
                }
            });
        } else {
            $.ajax({
                url: SD.config.rootPath + 'bookshelf/favor',
                data: {book_id: book_id},
                beforeSend: function() {
                    self.prop('disabled', true);
                },
                complete: function() {
                    self.prop('disabled', false);
                },
                success: function (res) {
                    if (res.code == 100000) {
                        self.attr('data-favor',1);
                        self.addClass('favored');
                        self.find('.J_FavorText').html('移除书架');
                    }
                    SD.util.alert(res.tip,1);
                }
            });
        }
    });


    //分页跳转
    $(document).on('click', '.pageSkipQd', function(event) {
        var url = $('#curr_url').val();
        if ($('#curr_url').length) {
            var $page = $(this).closest('li.pageSkip');
            var total = parseInt($page.find('i').text());
            var $input = $page.find('input');
            var input = parseInt($input.val());
            if (isNaN(input)) {
                return false;
            }
            if (input < 1) {
                input = 1;
                $input.val(input);
            }
            if (input > total) {
                input = total;
                $input.val(input);
            }

            //书评翻页
            if (url.indexOf("change_review_page") != '-1') {
                change_review_page(input);
            }else if (url.indexOf("change_comment_page") != '-1'){
                change_comment_page(input);
            }
            else {
                url += '/' + input;
                window.location.href = url;
            }
        }
    });


    /*$(document).on('click', '#search,#button_search', function(event) {
        var url = SD.config.rootPath + 'index/get_search_book_list/';
        $key=$(this).closest('form').find("input[name='key']").val();
        $target=$(this).closest('form').prop('target');
        console.log($target);
        if ($key.length){
            window.open(url+$key,$target);
        }else {
            return false;
        }
    });*/


    //每天领取推荐票
    (function  () {
        if (!(typeof(SD.userinfo) == "undefined") && SD.userinfo.reader_id!=0) {
            //显示弹框
            if (SD.util.Cookie.get('get_task_type_sign') !== '1') {
                get_daily_task_bonus();
            }
        }

        function GetDateStr(AddDayCount) {
            var dd = new Date();
            var h = dd.getHours();
            if (h>=5){
                dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
            }
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;//获取当前月份的日期 
            var d = dd.getDate();
            return y+"-"+m+"-"+d+" 05:00:00";
        }



        function get_daily_task_bonus(){
            $.ajax({
                url: SD.config.rootPath + 'reader/get_daily_task_bonus',
                data: {task_type:1},
                success: function (res) {
                    if (res.code == 100000) {
                        var msg = res.tip ? res.tip : '今日首次登录成功！';
                        var recommend=res.data.bonus.recommend;
                        var exp=res.data.bonus.exp;
                        var gift_hlb=res.data.bonus.hlb;
                        msg=msg+'<br>推荐票+'+recommend;
                        if (exp){
                            msg=msg+'<br>经验+'+exp;
                        }
                        if (gift_hlb){
                            msg=msg+'<br>赠币+'+gift_hlb;
                        }
                        msg=msg+"<br>";
                        SD.util.alert(msg,3);
                        $('#dialog-tip').height(150);//手动增加高度
                        $(".J_Recommend").text(res.data.prop_info.rest_recommend);
                        $(".J_GHLB").text(res.data.prop_info.rest_gift_hlb);
                        SD.util.Cookie.set('get_task_type_sign', 1, {
                            domain: document.domain,
                            path: "/",
                            expires: new Date(GetDateStr(1))
                        });

                        // window.location.reload();
                    } else if (res.code == 340003) {
                        SD.util.Cookie.set('get_task_type_sign', 1, {
                            domain: document.domain,
                            path: "/",
                            expires: new Date(GetDateStr(1))
                        });
                    } else {
                        // SD.util.alert(res.tip,1);
                    }
                }
            });
        }
    })();


    //wap新增功能
    $(document).on('click', '#search_btn', function(event) {
        $("#global_search_body").show();
    });
    $(document).on('click', '#search_close_btn', function(event) {
        $("#global_search_body").hide();
    });
    $(document).on('click', '#list_btn', function(event) {
        $("#global_menu_body").show();
    });
    $(document).on('click', '#list_close_btn', function(event) {
        $("#global_menu_body").hide()
    });
    $(document).on('click', '.J_Tag', function(event) {
        var self = $(this);
        var tag = self.text();
        window.location.href = SD.config.rootPath+"index/search_book?tag="+tag;
    });

});



var Img={
    _uri: '',
    _imgWidth:420,
    _imgHeight:420,
    /*  文件选择框
     *   FileVal     : 选择后用于存放结果的元素
     *   FileUpload  : FileUpload上传文件框
     * */
    OpenBrowse: function openBrowse(FileVal,FileUpload){
        var ie=navigator.appName=="Microsoft Internet Explorer" ? true : false;
        if(ie){
            document.getElementById(FileUpload).click();

            var sourceEl = document.getElementById(FileVal);
            if(null==sourceEl || typeof(sourceEl)==undefined){

            } else{
                document.getElementById(FileVal).value=document.getElementById("upload_file").value;
            }

        }else{
            var a=document.createEvent("MouseEvents");//FF的处理
            a.initEvent("click", true, true);
            document.getElementById(FileUpload).dispatchEvent(a);
        }

    }
    /*
     *   通用裁剪图片方法,需要引入 outwindow1及样式
     *   图片提交后通过返回图片地址调用此函数来启动裁剪窗口
     * */
    ,showImg:function show_img(filepath) {
        //alert(filepath);
        $('div[class="img_a"]').show();
        //$("form[id='uploadFrom']").hide();
        $('#SaveCropPic').show();
        var newFile=filepath+'?'+Math.random();
        $("#img_2").attr('src',newFile);
        $("#img_1").attr('src',newFile);

        var img=$('#img_1');
        this.CropImg(img);
    },

    /*  显示  图像处理界面  */
    showUploadWindow:function() {
        $("form[id='uploadFrom']").show();
        $('div[class="img_a"]').hide();

        $(".outwindow1").show();
        var img=$('#img_1');
        this.CropImg(img);
    },
    //  ----    载入图片、选择图片区域 ----
    CropImg:function img_sf(simg,parent){

        //alert(simg + '/' + parent);

        //  var db=document.body;
        _imgWidth=simg.width();
        _imgHeight=simg.height();

        var db= document.getElementById(parent);
        //console.log(simg);

        var img1=document.getElementById('img_1');
        var img3=document.getElementById('img_3');
        var bl=[100/120,150/50,120/24]; //裁剪框为100，预览框为120，显示比例使用100/120,hw()中使用

        var div=document.getElementById('img_b3');
        var d_t=document.getElementById('img_b1');
        var d_y=document.getElementById('img_b4');
        var d_x=document.getElementById('img_b5');
        var d_l=document.getElementById('img_b2');
        var self={};
        var iwh=Math.min(_imgHeight,_imgWidth);
        var sf=document.getElementById('img_dsf');
        var hh = div.offsetHeight;
        var ww= div.offsetWidth;
        if(hh != ww){
            var bl=[100/100,150/50,120/24];//裁剪框为288*164，预览框为288*164，显示比例使用100/100,hw()中使用
        }
        if(_imgWidth<288){
            var bl=[_imgWidth/288,_imgWidth/288,_imgWidth/288];
        }
        hw();
        yd(div.offsetTop,div.offsetLeft);

        div.onmousedown=function(e){
            var e=e||event;
            self.x=e.clientX-this.offsetLeft;
            self.y=e.clientY+document.documentElement.scrollTop-this.offsetTop;
            try{e.preventDefault();}catch(o){e.returnValue = false;}
            document.onmousemove=function(e){
                var e=e||event;
                var t=e.clientY+document.documentElement.scrollTop-self.y ;
                var l=e.clientX-self.x;

                t=Math.min(t,_imgHeight-div.offsetHeight);
                l=Math.min(l,_imgWidth-div.offsetWidth);

                t=Math.max(t,0);
                l=Math.max(l,0);
                //console.log(123);
                yd(t,l);
            }
        }

        sf.onmousedown=div.onmouseup=function(){
            document.onmousemove='';
        }

        sf.onmousedown=function(e){
            var e=e||event;
            self.x=e.clientX-this.offsetLeft;
            self.y=e.clientY+document.documentElement.scrollTop-this.offsetTop;
            try{e.preventDefault();}catch(o){e.returnValue = false;}
            try{e.stopPropagation();}catch(o){e.cancelBubble = true;}
            document.onmousemove=function(e){
                var e=e||event;
                var t=e.clientY+document.documentElement.scrollTop-self.y;
                var l=e.clientX-self.x;

                //
                if(t>_imgHeight-div.offsetTop || l>_imgWidth-div.offsetLeft){
                    document.onmousemove='';
                }

                if(ww==hh){ //正方形用
                    l=Math.max(t,l);
                    l=l>iwh?iwh:l;
                    if(l<100){
                        l=100;
                    }
                    if(t<100)
                        t = 100;
                    sff(l,l);
                }else{//288*164用
                    if(_imgHeight>_imgWidth){
                        //l=l>iwh?iwh:l;
                        //console.log('鼠标t:'+t);
                        //console.log('鼠标l:'+l);
                        if(t>Math.floor(l*hh/ww)){
                            l = Math.floor(t*ww/hh);
                        }else{
                            t = Math.floor(l*hh/ww);
                        }
                    }else{
                        //t=t>iwh?iwh:t;
                        if(l> Math.floor(t*ww/hh)){
                            t = Math.floor(l*hh/ww);
                        }else{
                            l = Math.floor(t*ww/hh);
                        }
                    }
                    sff(t,l);
                }
            }
        }

        function sff(t,l){

            var w=div.offsetWidth;

            if(t==l){//正方形用
                if(l>_imgWidth-div.offsetLeft-10)
                    l = _imgWidth-div.offsetLeft-10;
                if(t>_imgHeight-div.offsetTop-10)
                    t = _imgHeight-div.offsetTop-10;
                t =  t>l?l:t;
                l =  t;
                bl=[w/120,w/50,w/24];
            }else{//288*164用
                if(_imgWidth<_imgHeight){
                    if(l>_imgWidth-div.offsetLeft-10){
                        l = _imgWidth-div.offsetLeft-10;
                        t=l*164/288;
                    }
                    if(t>410){
                        t=410;
                        l=t/164*288;
                    }
                    console.log('t:'+t+",l:"+l);
                }else{
                    if(t>_imgHeight-div.offsetTop-10)
                        t = _imgHeight-div.offsetTop-10;

                    if(l>410){
                        l=410;
                        t=l*164/288;
                    }
                    if(l>_imgWidth-div.offsetLeft-10){
                        l = _imgWidth-div.offsetLeft-10;
                        t = l*164/288;
                    }
                    if(l>(_imgHeight-div.offsetTop-10)/164*288){
                        l=(_imgHeight-div.offsetTop-10)/164*288;

                        t=l*164/288;
                    }
                }
                bl=[w/288,w/140,w/60];
            }

            sf.style.top=t+'px';
            sf.style.left=l+'px';

            div.style.width=(l+10)+'px';
            div.style.height=(t+10)+'px';


            //console.log(div.style.width);
            //console.log(div.style.height);

            yd(div.offsetTop,div.offsetLeft);

            hw();
            db.imgh=l+10;
        }

        //  鼠标移动
        function yd(t,l){
            d_t.style.height=t+'px';
            d_x.style.height=_imgHeight-t-div.offsetHeight+'px';
            d_l.style.top=d_y.style.top=div.style.top=t+'px';
            d_l.style.width=div.style.left=l+'px';
            d_y.style.width=_imgWidth-l-div.offsetWidth+'px';
            d_l.style.height=d_y.style.height=div.offsetHeight+'px';
            //  第一张缩略图
            img1.style.left=-l/bl[0]+'px';
            if(div.offsetWidth==288&&ww!=hh){//288*164用
                img1.style.top=-t+'px';
            }else{//正方形用
                img1.style.top=-t/bl[0]+'px';
            }



            //  第二张缩略图
            if($('.img_c_2').hasClass('img_c_2')){
                var w=div.offsetWidth;
                //bl=[w/164,w/164,w/164];
                img3.style.top=-t/bl[0]+'px';
                img3.style.left=-l/bl[0]+'px';
            }




            db.xy=[t,l];
        }

        //  --  按比例设置图片大小：宽、高
        function hw(){
            //  $("#test123").text('height=' + _imgWidth + '/width=' + img_width + '/ratio=' + bl[0]);

            $("#img_1").css('height',_imgHeight/bl[0]);
            $("#img_1").css('width',_imgWidth/bl[0]);

            if($('.img_c_2').hasClass('img_c_2')) {
                //img3.height= _imgHeight/bl[0];
                //img3.width=_imgWidth/bl[0];
                $("#img_3").css('height',_imgHeight/bl[0]);
                $("#img_3").css('width',_imgWidth/bl[0]);
            }
        }

    },
    //  ----    保存裁剪图片  ----
    SaveCropImg:function(UpSource,UploadUrl) {
        var FileUrl=$('img[id="img_2"]').attr('src');
        var img3=document.getElementById('img_b3');
        var left=img3.offsetLeft;
        var top=img3.offsetTop;
        var width=img3.offsetWidth;
        var height=img3.offsetHeight;
        var url1=UploadUrl;             //  保存图片的地址及类型： community/upload/savepic?type=music&id=100

        $("#left").val(left);
        $("#top").val(top);
        $("#width").val(width);
        $("#height").val(height);
        //alert($("#"+UpSource).val());
        $("#"+UpSource).parent().submit();
    },

    addCallbacks: function()
    {
        $('input[id="SaveCropPic"]').bind('click',book.SaveCropImg);
    },

    /**
     * Initializes the view (highlighters, callbacks, etc)
     */
    initializeView: function(uri)
    {
        this._uri = uri;
        this.addCallbacks();
    }

};