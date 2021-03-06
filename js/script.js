(function ($) {
    'use strict';


    // ========================================================================= //
    //  //SMOOTH SCROLL
    // ========================================================================= //


    $(document).on("scroll", onScroll);

//    $('a[href^="#"]').on('click', function (e) {
//        e.preventDefault();
//        $(document).off("scroll");
//
//        $('a').each(function () {
//            $(this).removeClass('active');
//            if ($(window).width() < 768) {
//                $('.nav-menu').slideUp();
//            }
//        });
//
//        $(this).addClass('active');
//
//        var target = this.hash,
//                menu = target;
//
//        target = $(target);
//        $('html, body').stop().animate({
//            'scrollTop': target.offset().top - 0
//        }, 500, 'swing', function () {
//            window.location.hash = target.selector;
//            $(document).on("scroll", onScroll);
//        });
//    });


    function onScroll(event) {
        if ($('.home').length) {
            var scrollPos = $(document).scrollTop();
            $('nav ul li a').each(function () {
                var currLink = $(this);
                var refElement = $(currLink.attr("href"));
            });
        }
    }


    // Preloader js    
    $(window).on('load', function () {
        $('.preloader').fadeOut(700);
    });

    // Background-images
    $('[data-background]').each(function () {
        $(this).css({
            'background-image': 'url(' + $(this).data('background') + ')'
        });
    });

    //  Search Form Open
    $('#searchOpen').on('click', function () {
        $('.search-wrapper').addClass('open');
    });
    $('#searchClose').on('click', function () {
        $('.search-wrapper').removeClass('open');
    });

    //Hero Slider
    $('.hero-slider').slick({
        autoplay: true,
        infinite: true,
        arrows: true,
        prevArrow: '<button type=\'button\' class=\'prevArrow\'><span class=\'fa fa-chevron-left\'></span></button>',
        nextArrow: '<button type=\'button\' class=\'nextArrow\'><span class=\'fa fa-chevron-right\'></span></button>',
        dots: false,
        autoplaySpeed: 7000,
        pauseOnFocus: false,
        pauseOnHover: false
    });
    $('.hero-slider').slickAnimation();

    //  Count Up
    function counter() {
        var oTop;
        if ($('.count').length !== 0) {
            oTop = $('.count').offset().top - window.innerHeight;
        }
        if ($(window).scrollTop() > oTop) {
            $('.count').each(function () {
                var $this = $(this),
                        countTo = $this.attr('data-count');
                $({
                    countNum: $this.text()
                }).animate({
                    countNum: countTo
                }, {
                    duration: 1000,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $this.text(this.countNum);
                    }
                });
            });
        }
    }
    $(window).on('scroll', function () {
        counter();
    });

    // venobox popup
    $('.venobox').venobox();

    // AOS
    AOS.init({
        once: true
    });

    //testimonial slider
    $('.testimonial-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        dots: false,
        arrows: true,
        prevArrow: '<button type=\'button\' class=\'prevArrow\'></button>',
        nextArrow: '<button type=\'button\' class=\'nextArrow\'></button>',
        pauseOnFocus: false,
        pauseOnHover: false
    });

    //testimonial slider 2
    $('.testimonial-slider-2').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        fade: false,
        dots: true,
        arrows: false,
        pauseOnFocus: false,
        pauseOnHover: false,
        customPaging: function (slider, i) {
            var dotImage = $(slider.$slides[i]).data('dot-image');
            return '<a><img src="' + dotImage + '"></a>';
        }
    });


    // filter
    $(document).ready(function () {
        var containerEl = document.querySelector('.filtr-container');
        var filterizd;
        if (containerEl) {
            filterizd = $('.filtr-container').filterizr({});
        }
        //Active changer
        $('.filter-controls li').on('click', function () {
            $('.filter-controls li').removeClass('active');
            $(this).addClass('active');
        });
    });


    // Accordions
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).parent().find('.fa-plus').removeClass('fa-plus').addClass('fa-minus');
    }).on('hidden.bs.collapse', function () {
        $(this).parent().find('.fa-minus').removeClass('fa-minus').addClass('fa-plus');
    });

    // -----------------------------------------------------------------------
    // Pricing table
    // -----------------------------------------------------------------------

    //hide the subtle gradient layer (.pricing-list > li::after) when pricing table has been scrolled to the end (mobile version only)
    checkScrolling($('.pricing-body'));
    $(window).on('resize', function () {
        window.requestAnimationFrame(function () {
            checkScrolling($('.pricing-body'));
        });
    });
    $('.pricing-body').on('scroll', function () {
        var selected = $(this);
        window.requestAnimationFrame(function () {
            checkScrolling(selected);
        });
    });

    function checkScrolling(tables) {
        tables.each(function () {
            var table = $(this),
                    totalTableWidth = parseInt(table.children('.pricing-features').width()),
                    tableViewport = parseInt(table.width());
            if (table.scrollLeft() >= totalTableWidth - tableViewport - 1) {
                table.parent('li').addClass('is-ended');
            } else {
                table.parent('li').removeClass('is-ended');
            }
        });
    }

    //switch from monthly to annual pricing tables
    bouncy_filter($('.pricing-container'));

    function bouncy_filter(container) {
        container.each(function () {
            var pricing_table = $(this);
            var filter_list_container = pricing_table.children('.pricing-switcher'),
                    filter_radios = filter_list_container.find('input[type="radio"]'),
                    pricing_table_wrapper = pricing_table.find('.pricing-wrapper');

            //store pricing table items
            var table_elements = {};
            filter_radios.each(function () {
                var filter_type = $(this).val();
                table_elements[filter_type] = pricing_table_wrapper.find('li[data-type="' + filter_type + '"]');
            });

            //detect input change event
            filter_radios.on('change', function (event) {
                event.preventDefault();
                //detect which radio input item was checked
                var selected_filter = $(event.target).val();

                //give higher z-index to the pricing table items selected by the radio input
                show_selected_items(table_elements[selected_filter]);

                //rotate each pricing-wrapper 
                //at the end of the animation hide the not-selected pricing tables and rotate back the .pricing-wrapper

                if (!Modernizr.cssanimations) {
                    hide_not_selected_items(table_elements, selected_filter);
                    pricing_table_wrapper.removeClass('is-switched');
                } else {
                    pricing_table_wrapper.addClass('is-switched').eq(0).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                        hide_not_selected_items(table_elements, selected_filter);
                        pricing_table_wrapper.removeClass('is-switched');
                        //change rotation direction if .pricing-list has the .bounce-invert class
                        if (pricing_table.find('.pricing-list').hasClass('bounce-invert'))
                            pricing_table_wrapper.toggleClass('reverse-animation');
                    });
                }
            });
        });
    }

    function show_selected_items(selected_elements) {
        selected_elements.addClass('is-selected');
    }

    function hide_not_selected_items(table_containers, filter) {
        $.each(table_containers, function (key, value) {
            if (key !== filter) {
                $(this).removeClass('is-visible is-selected').addClass('is-hidden');

            } else {
                $(this).addClass('is-visible').removeClass('is-hidden is-selected');
            }
        });
    }

    //Active changer
    $('.pricing-duration').on('click', function () {
        $('.pricing-duration').removeClass('active');
        $(this).addClass('active');
    });

    // -----------------------------------------------------------------------
    // Pricing table end
    // -----------------------------------------------------------------------

})(jQuery);


/*
 * ----------------------------------------------------------------------------------------
 *  BODY SCROLL TO UP 
 * ----------------------------------------------------------------------------------------
 */


$(window).scroll(function () {
    if ($(this).scrollTop() > 250) {
        $('.body-scrollup').fadeIn();
    } else {
        $('.body-scrollup').fadeOut();
    }
});
$('.body-scrollup').on("click", function () {
    $("html, body").animate({
        scrollTop: 0
    }, 800);
    return false;
});

$(window).resize(function () {
    if (window.innerWidth < 991) {
        $('.conainer-part').addClass('container').removeClass('conainer-part');
    } else {
        $('#container').addClass('conainer-part').removeClass('container');
    }
});

$(window).resize(function () {
    if (window.innerWidth < 991) {
        $('.t-header-conainer-part').addClass('container').removeClass('t-header-conainer-part');
    } else {
        $('#t-header-container').addClass('t-header-conainer-part').removeClass('container');
    }
});






/*modal date */
var date = new Date();
var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

var optSimple = {
    format: 'mm-dd-yyyy',
    todayHighlight: true,
    orientation: 'bottom right',
    autoclose: true,
    container: '#sandbox'
};

var optComponent = {
    format: 'mm-dd-yyyy',
    container: '#datePicker',
    orientation: 'auto top',
    todayHighlight: true,
    autoclose: true
};

// SIMPLmoveDateE
$('#moveDate').datepicker(optSimple);

// COMPONENT
$('#datePicker').datepicker(optComponent);

// ===================================

$('#datepicker1').datepicker({
    format: "mm : dd : yyyy",
    todayHighlight: true,
    autoclose: true,
    container: '#box1',
    orientation: 'top right'
});

$('#datepicker2').datepicker({
    format: 'mm \\ dd \\ yyyy',
    todayHighlight: true,
    autoclose: true,
    container: '#box2',
    orientation: 'top right'
});

$('#datepicker1, #datepicker2, #simple, #datePicker').datepicker('setDate', today);



/**/



$(document).on('ready', function () {
    $(".vertical-center-4").slick({
        dots: true,
        vertical: true,
        centerMode: true,
        slidesToShow: 4,
        slidesToScroll: 2
    });
    $(".vertical-center-3").slick({
        dots: true,
        vertical: true,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 3
    });
    $(".vertical-center-2").slick({
        dots: true,
        vertical: true,
        centerMode: true,
        slidesToShow: 2,
        slidesToScroll: 2
    });
    $(".vertical-center").slick({
        dots: true,
        vertical: true,
        centerMode: true,
    });
    $(".vertical").slick({
        dots: true,
        vertical: true,
        slidesToShow: 3,
        slidesToScroll: 3
    });
    $(".regular").slick({
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3
    });
    $(".center").slick({
        dots: true,
        infinite: true,
        centerMode: true,
        slidesToShow: 5,
        slidesToScroll: 3
    });
    $(".variable").slick({
        dots: true,
        infinite: true,
        variableWidth: true
    });
    $(".lazy").slick({
        lazyLoad: 'ondemand', // ondemand progressive anticipated
        infinite: true
    });
    $('.single-item').slick();

});