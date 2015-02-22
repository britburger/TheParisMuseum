(function (window, $) {
    "use strict";

    /* ---------------------------------- */
    /* Global */

    var $Window = $.Window = $(window),
        $Document = $.Document = $(document),
        _Mobile = ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Blackberry/i) || navigator.userAgent.match(/webOS/i) );

    var $Html = $.Html,
        $Body = $.Body,
        $Wrapper,
        $Scroll,
        _IE_LT9;

    /* ---------------------------------- */

    /* App */

    var _ = window._ = {

        settings: {
            EASE: 'easeInOutQuart',
            EASE_SPEED: 600
        },

        /* Events */

        Events: {
            INIT: 'siteInit',
            NAV_INPAGE: 'navInPage'
        },

        /* Plugins */

        Plugins: {

            plugin: {},
            load: function ($e) {
                var p = $e.attr('data-script');
                if (_.Plugins.plugin[p]) {
                    $e.removeAttr('data-script');
                    new _.Plugins.plugin[p]($e);
                }
            },
            autoload: function () {
                $('[data-script]').each(function(){_.Plugins.load($(this));});
            },

            register: function(plugin,autorun) {
                $.extend(_.Plugins.plugin, plugin);
            }
        },

        /* Application */

        Core: {
            init: function () {

                $Html = $.Html =  $('html');
                $Body = $.Body =  $('body');
                $Scroll = ($.browser.mozilla || $.browser.msie) ? $('html') : $Body;
                _IE_LT9 = $('script[data-ie]').length > 0;

                _.Plugins.autoload();
                _.Core.global();

            },
            global: function() {
                FastClick.attach(document.body);


                $('input[type=text],input[type=password],textarea').each(function(){new _.Core.Input($(this));});
                $('a[data-link]').each(function(){$(this).attr('target',$(this).attr('data-link'));$(this).removeAttr('data-link');});
                $('*[data-nav=inpage]').each(function(){ new _.Core.SeekInPage($(this)); });

                if (!Modernizr.svg) {
                    $('img[data-png]').each(function(){$(this).attr('src',$(this).attr('data-png'));$(this).removeAttr('data-png');});
                }
                var $fx = $(".fx");
                if (!_Mobile) {
                    $(window).stuck();
                    TweenMax.to($fx, 0, {y: 60})
                    $($fx).waypoint(function(direction){
                        TweenMax.to($(this.element), 0, {autoAlpha: 1, y: 0, overwrite: "all"})
                        this.destroy()
                    }, {
                        offset: '85%'
                    });
                } else {
                    TweenMax.to($fx, 0, {autoAlpha:1});
                }

                $('#header-image').waitForImages({
                    finished: function() {
                        TweenMax.to($(this), 1.5, {opacity: 1})
                    },
                    waitForAll: true
                });

                var text = $(".animate"), lines = $(".line");
                TweenMax.ticker.fps(60);
                TweenMax.set(lines, {visibility:"visible"});
                TweenMax.set($(".lead"), {visibility:"visible"});

                var tl1 = new TimelineMax, split = new SplitText(text, {type: "words,chars"});
                for (var s = 0; s < split.chars.length; s++) {
                    $(split.chars[s]).addClass("tall-step")
                }
                tl1.staggerTo(split.chars, 1, {opacity: 1, y: 0, delay: .1, ease: Power3.easeOut}, .01);
                tl1.pause();

                var tl2 = new TimelineMax();
                tl2.staggerFromTo(lines, 3, {drawSVG:"100%", opacity:"1"}, {drawSVG:"50% 50%", opacity:"0", ease: Power3.easeIn}, -0.2);
                tl2.timeScale(2);
                tl2.progress(1, false);
                tl2.pause();
                TweenMax.render();

                $("#intro-copy").waypoint(function(direction){
                    setTimeout(function () {
                        tl1.play();
                        tl2.reverse(0);
                    }, 400);
                    this.destroy();
                }, {
                    offset: '85%'
                });

            },
            SeekInPage: function ($this) {
                var $self = $this,
                    _seekID = $self.attr('data-id');
                $self
                    .bind('click',_click)
                    .bind(_.Events.NAV_INPAGE,_seekInPage);
                    $Body.bind(_.Events.NAV_INPAGE,_seekInPage);

                function _click(e) {
                    $self.triggerHandler(_.Events.NAV_INPAGE,_seekID);
                    e.preventDefault();
                }

                function _seekInPage(e,id) {
                    var $this = $('[data-nav-id='+id+']'),
                        _offset = $this.attr('data-nav-offset') ? parseInt($this.attr('data-nav-offset')) : 0;
                         $Scroll.stop().animate({scrollTop: ($this.offset().top - _offset)}, _.settings.EASE_SPEED, _.settings.EASE);
                }

            },
            Input: function ($this){

                $this.each(function (index) {

                    var $self = $(this),_placeholder = $self.attr('placeholder');

                    if (!Modernizr.input.placeholder) {
                        $self.val(_placeholder);
                        $self.live('focus',function(){if ($self.val()==_placeholder) $self.val('');})
                        $self.live('blur',function(){if ($self.val()=='') $self.val(_placeholder);})
                    }
                });

                return $this;

            }
        }
    };
    _.Plugins.register({

        /* Shell: Remove for production */

        Shell: function ($this){

            $this.each(function (index) {

                var $self = $(this);

                console.log('Shell');

            });
            return $this;
        }
    });
    $Document.ready(_.Core.init);
})(window,$);