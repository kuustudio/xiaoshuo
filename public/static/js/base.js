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
