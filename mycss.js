/**
 * Created by matthewr on 5/18/2017.
 */

$(document).ready(function(){

    // //----- remove whitespace, including carriage returns, from body to preserve "width" and "push" percentages
    var xHTML = document.getElementsByTagName('body')[0].innerHTML;
    xHTML = xHTML.replace(/>\s+</g,'><');
    $('body').html(xHTML);

    (function mycss(){
        var xNavWraps;
        var xPause;

        window.onload = (function(){
            wrapElements(function(){
                xNavWraps = $("div.nav-wrapper");
                $.each(xNavWraps, function(index, item) {
                    var xTotWidth = 80;
                    $(this).children().each(function () {
                        xTotWidth += parseInt($(this).outerWidth());
                    });
                    $(this).prop("minWidth",xTotWidth);
                });
                $(".wrap-dd").removeClass("hidden");
                makeOpaque(function(){
                    onResize();
                });
            });
        })();


        function makeOpaque(callback){
            $('body').css({"opacity":1});
            callback();
        }

        function wrapElements(callback){

            var xNavBars = $("div.nav-bar, div.nav-bar-min");
            $.each(xNavBars, function(index, item){
                $(this).wrapInner('<div class="nav-wrapper"></div>');
                if( $(this).find('.nav-logo').length != 0 ){
                    var xImgSrc = $(this).find('.nav-logo img').attr("src");
                    $(this).find(".nav-wrapper").before('<div class="fixed-logo"><div><div><img src="' + xImgSrc + '" /></div></div></div>');
                }
                var xNavItems = $(this).find(".nav-wrapper").children('.nav, .nav-left, .nav-right');
                $.each(xNavItems, function(ind, itm){
                    $(this).find(".dd-item").wrapAll('<div class="wrap-dd hidden"></div>');
                });
                $(this).find('[class^="nav"].dd > div').before('<span class="dd-symb"> &#8681 </span>');
                $(this).find(".nav-wrapper").before('<div class="ellipsis"><div><div> &#8681 </div></div></div>');
            });
            var xFormGroups = $(".fg");
            $.each(xFormGroups, function(item, index){
                if( $(this).find(".fg-title").length > 0){
                    $(this).addClass("fg-lbl");
                }
            });

            var xDivs = $('[class*="2xs"], [class*="xs"], [class*="sm"], [class*="md"], [class*="lg"], [class*="xl"], div.nav-wrapper > [class^="nav"], div.nav-wrapper > [class*=" nav"]');
            $.each(xDivs, function(index, item){
                var xSpecClasses = [];
                var xRemoveClasses = [];
                var xSizes = ['2xs', '1xs', 'sm', 'md', 'lg', 'xl'];
                var xClassList =  $(this).attr('class').split(/\s+/);
                $.each(xClassList, function(i, itm){
                    if( xClassList[i].indexOf('2xs-') >= 0
                        || xClassList[i].indexOf('1xs-') >= 0
                        || xClassList[i].indexOf('sm-') >= 0
                        || xClassList[i].indexOf('md-') >= 0
                        || xClassList[i].indexOf('lg-') >= 0
                        || xClassList[i].indexOf('xl-') >= 0
                        || xClassList[i].indexOf('-2xs') >= 0
                        || xClassList[i].indexOf('-1xs') >= 0
                        || xClassList[i].indexOf('-sm') >= 0
                        || xClassList[i].indexOf('-md') >= 0
                        || xClassList[i].indexOf('-lg') >= 0
                        || xClassList[i].indexOf('-xl') >= 0
                        || xClassList[i] == '2xs'
                        || xClassList[i] == '1xs'
                        || xClassList[i] == 'sm'
                        || xClassList[i] == 'md'
                        || xClassList[i] == 'lg'
                        || xClassList[i] == 'xl'
                    ){
                        xRemoveClasses.push(xClassList[i]);
                        var xFrags = [];
                        for(var j=0; j<xSizes.length; j++){
                            if(xClassList[i].indexOf(xSizes[j] + '-') == 0){
                                var xFrags = xClassList[i].split("-");
                                for(var k=0; k<xFrags.length; k++){
                                    if(xFrags[k] != xSizes[j]){
                                        if(xFrags[k] == "w5"){
                                            xFrags[k] = "w05";
                                        }else if(xFrags[k] == 'p0'){
                                            xFrags[k] = "p00";
                                        }else if(xFrags[k] == "p5"){
                                            xFrags[k] = "p05";
                                        }
                                        xSpecClasses.push(xSizes[j] + '-' + xFrags[k]);
                                    }
                                }
                            }
                        }
                        if(xFrags.length <= 1){  //---------- if no fragments, add the entire class
                            xSpecClasses.push(xClassList[i]);
                        }
                    }else if( xClassList[i].indexOf('nav') == 0 || xClassList[i] == 'vertical' || xClassList[i] == 'hidden'){
                        xRemoveClasses.push(xClassList[i]);
                        xSpecClasses.push(xClassList[i]);
                    }
                });
                for(var i=0; i<xRemoveClasses.length; i++){
                    $(this).removeClass(xRemoveClasses[i]);
                }
                if($(this).is('div')){
                    $(this).wrap('<div class="' + xSpecClasses.join(" ") + '"><div></div></div>');
                    // $(this).wrap('<div class="' + xSpecClasses.join(" ") + '"></div>');
                }else{
                    $(this).addClass(xSpecClasses.join(" "));
                }
            });

            callback();
        }

        $(window).resize(onResize);

        function resizeRows(callback){
            $('[class*="2xs-"] .row, [class*="1xs-"] .row, [class*="sm-"] .row, [class*="md-"] .row, [class*="lg-"] .row, [class*="xl-"] .row').css('height', 'auto');
            var xItems = document.getElementsByClassName("row");
            for(var i=0; i<xItems.length; i++){
                xItems[i].style.height = 'auto';
            }
            callback();
        }
        function onResize(callback){

            resizeRows(function(){
                //----------- size the height of all child cells within a div.row to their parents' heights (for vertical alignment)
                var xRows = $("div.row:not(.row .row)");
                $.each(xRows, function(index, item){
                    var xRow = $(this);
                    var xItems = xRow.children('[class*="2xs-"], [class*="1xs-"], [class*="sm-"], [class*="md-"], [class*="lg-"], [class*="xl-"]');
                    resetHeights(xItems, function(){
                        var xHeight = 0;
                        $.each(xItems, function(index, item){
                            if(parseInt($(this).height()) > xHeight){
                                xHeight = $(this).height();
                            }
                        });
                        xRow.children('[class*="2xs-"], [class*="1xs-"], [class*="sm-"], [class*="md-"], [class*="lg-"], [class*="xl-"]').height(xHeight);
                    });
                });

                function resetHeights(xItems, callback){
                    $.each(xItems, function(index, item){
                        $(this).css('height', 'auto');
                    });
                    callback();
                }

                var xCells = $('[class*="2xs-"]>div>div, [class*="1xs-"]>div>div, [class*="sm-"]>div>div, [class*="md-"]>div>div, [class*="lg-"]>div>div, [class*="xl-"]>div>div');
                // var xCells = $('[class*="2xs-"]>div, [class*="1xs-"]>div, [class*="sm-"]>div, [class*="md-"]>div, [class*="lg-"]>div, [class*="xl-"]>div');

                var xFirstRows = [];
                $.each(xCells, function(index, item){
                    if( $(this).children(".row").length > 0 ){
                        xFirstRows.push( $(this).children(".row")[0] );
                    }
                });
                var xSubRows = $('[class*="2xs-"]>div>div>div.row, [class*="1xs-"]>div>div>div.row, [class*="sm-"]>div>div>div.row, [class*="md-"]>div>div>div.row, [class*="lg-"]>div>div>div.row, [class*="xl-"]>div>div>div.row');
                // var xSubRows = $('[class*="2xs-"]>div>div.row, [class*="1xs-"]>div>div.row, [class*="sm-"]>div>div.row, [class*="md-"]>div>div.row, [class*="lg-"]>div>div.row, [class*="xl-"]>div>div.row');
                $.each(xFirstRows, function(index, item){
                    var xSubRow = $(this);
                    var xParentHeight = xSubRow.parent().parent().parent().innerHeight();
                    var xSiblings = xSubRow.siblings();
                    xSubRow.css('height', 'auto');
                    xSiblings.css('height', 'auto');
                    var xHeight = xSubRow.outerHeight();
                    $.each(xSiblings, function(){
                        xHeight += $(this).outerHeight();
                    });
                    if(xHeight < xParentHeight){
                        var xDelta = parseFloat(((xParentHeight - xHeight) / (xSiblings.length +1)).toFixed(1));
                        // console.log(xDelta);
                        xTempHeight = xSubRow.height();
                        console.log($(item).attr("id") + ': ' + xTempHeight);
                        xSubRow.height( xTempHeight + xDelta);
                        $.each(xSiblings, function(index, item){
                            console.log($(item).attr("id") + ': ' + xTempHeight);
                            xTempHeight = $(item).height();
                            $(item).height( xTempHeight + xDelta);
                        });
                    }
                });

                $.each(xNavWraps, function(index, item){
                    if( $(this).innerWidth() <= $(this).prop("minWidth") ){
                        //--------- collapse nav-bar
                        $(this).find(".wrap-dd").css({"padding":"3px", "left":"10%", "width":"90%", "position":"relative", "top":"0"});
                        $("span.dd-symb").css({"height":"auto"});
                        $(this).hide(1);
                        $(this).addClass("vertical-wrap");
                        $(this).find('.nav-logo').addClass("hidden");
                        $(this).children("div:not(.nav-logo)").addClass("vertical");
                        $(this).parent().children('.ellipsis, .fixed-logo').css({"display":"block"});
                    }else{
                        //--------- expand nav-bar
                        $(this).find(".wrap-dd").css({"padding":"", "left":"", "width":"", "position":"", "top":""});
                        $(this).parent().children('.ellipsis, .fixed-logo').css({"display":""});
                        $(this).children("div").removeClass("vertical");
                        $(this).find('.nav-logo').removeClass("hidden");
                        $(this).removeClass("vertical-wrap");
                        $(this).show(1);
                    }
                    if(callback  && typeof(callback) == 'function'){
                        callback();
                    }
                });

            });

        }

        $(".dd-item").click(function(){
            var xParent = $(this).parent();
            //-------- get the parent nav-bar of this element
            while(!xParent.hasClass('nav-bar') && !xParent.is('body')){
                xParent = xParent.parent();
            }
            if(xParent.find('.ellipsis').is(":visible")){
                xParent.find('.nav-wrapper').slideUp();
            }
        });

        $("div.dd").click(function(){
            var xParent = $(this).parent();
            //-------- get the parent nav-bar of this element
            while(!xParent.hasClass('nav-bar') && !xParent.is('body')){
                xParent = xParent.parent();
            }

            //------- determine if this drop-down menu extends out beyond the right border of the nav-bar
            var xDelta = ($(this).offset().left + 200) - (xParent.offset().left + xParent.innerWidth());
            if( xDelta > 0 ){
                $(this).find(".wrap-dd").css({"left": -xDelta});
            }

            $(this).find(".wrap-dd").slideToggle(300);

            //------- hide any other expanded drop-down menus
            var xThis = $(this).find(".wrap-dd");
            xThis.prop("active", true);
            contractDDs(function(){
                xThis.prop("active", false);
            });
        });

        function contractDDs(callback){
            var xDDWraps = $(".wrap-dd");
            $.each(xDDWraps, function(index, item){
                if( $(this).is(":visible") && !$(this).prop("active")){
                    $(this).slideToggle(300);
                }
            });
            if(callback){
                callback();
            }
        }

        $('body').on("click", ".ellipsis", function(){
            $(this).parent().children('.nav-wrapper').slideToggle(300);
        });

    })();

});