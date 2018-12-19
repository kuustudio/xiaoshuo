(function($, undefined) {
    function Placeholder(ele) {
        this.ele = $(ele);

        this.init();
    }

    Placeholder.prototype = {
        init: function() {
            var ele = this.ele;
            var placehoder = "";
            if (ele && !('placeholder' in document.createElement('input')) && (placehoder = ele.attr("placeholder"))) {
                ele.focus(function() {
                    if (ele.val() === placehoder) {
                        ele.val("");
                    };
                    ele.css("color", "");
                })
                ele.blur(function() {
                    if (ele.val() === "") {
                        ele.val(placehoder);
                        ele.css("color", "gray");
                    }
                })
                if (ele.val() === "") {
                    ele.val(placehoder);
                    ele.css("color", "gray");
                }
            }
        },
        destroy: function() {
            this.ele = null;
        }
    }
    $.fn.qfcplaceholder = function() {
        return new Placeholder(this.get(0));
    }
})(jQuery)