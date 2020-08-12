
/*
// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.s-categoryNav').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
    var st = $(this).scrollTop();

    if(st <= 81) {
        $('.s-categoryNav').removeClass('-fixed');
        $('.s-categoryNav').removeClass('nav-up');
    }
});

function scrollCheck() {
    if (didScroll) {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;
        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight && st > 81){
            // Scroll Down
            $('.s-categoryNav').removeClass('nav-down').addClass('nav-up');
            // $('.c-aside').removeClass('view-top').addClass('view-bottom');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height() && st > 81) {
                $('.s-categoryNav').removeClass('nav-up').addClass('nav-down');
                // $('.c-aside').removeClass('view-bottom').addClass('view-top');
                $('.s-categoryNav').addClass('-fixed');
            }
        }

        lastScrollTop = st;
        didScroll = false;
    }
}
*/

function validate_email(email)
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return (true);
    }
    return (false);
}

function create(htmlStr)
{
    var frag = document.createDocumentFragment();
    var temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function create_heading_tags(e)
{
    var tags = e.innerHTML.split(/,\s{0,}/);
    var temp = document.createElement('div');
    temp.className += "heading-tags";
    for (i = 0; i < tags.length; i++) {
        var fragment = create('<span class="heading-tag">' + tags[i] + '</span>');
        temp.appendChild(fragment);
    }
    e.parentNode.insertBefore(temp, e);
    e.remove();
}

$(document).ready(function() {

    $('.heading-tags').each(function() {
        create_heading_tags(this);
    });

    // Make shell prompt in rouge syntax highlight un-selectable.
    $(".nv").each(function(index) {
        if ($(this).html() == '$ ') {
            $(this).addClass("unselectable");
        }
    });

    $('#form-fname,#form-email').click(function() {
        $(this).removeClass('form-error');
    });

    $('#subscribe-form').submit(function(event) {

        event.preventDefault();

        var error = false;
        var form_name = $("#subscribe-form .input-wrapper input[name='fname']").val();
        var form_email = $("#subscribe-form .input-wrapper input[name='email']").val();

        // console.log({
        //     name: form_name,
        //     email: form_email
        // });

        if ((typeof form_name !== 'undefined') &&
            (form_name.length == 0 || form_name.length > 64)) {
            $('#form-fname').addClass('form-error');
            error = true;
        }

        if (validate_email(form_email) == false) {
            // console.log('Email validation error!');
            $('#form-email').addClass('form-error');
            error = true;
        }

        if (error) return false;

        $.ajax({
            type: 'POST',
            url: '/assets/php/subscribe.php',
            timeout: 5000,
            data: {
                name: form_name,
                email: form_email
            },
            success: function(data, textStatus) {
                $('#form-email,#subscribe-submit').hide();
                $('#submit-response').html('<p>Success!, you are now added to our list of hackers. You will hear from us soon.</p>');
            },
            error: function(xhr, textStatus, errorThrown) {
                $('#form-email,#subscribe-submit').hide();
                $('#submit-response').html('<p>Oops, your request failed! Please try again later.</p>');
            },
            statusCode: {
                500: function() {
                    $('#submit-response').html('<p>Request failed due to an internal error. Please contact us for support.</p>');
                }
            }
        });
    });

    //setInterval(scrollCheck, 250);

    $('#postContent a').addClass('post-link');

    $('a').each(function() {
        if( location.hostname !== this.hostname && this.hostname.length ) {
            if ( $(this).hasClass('post-link') ) {
                $(this).attr("target", "_blank");
            }
        }
    });

    $('#newsletter').on('change', function() {
        triggerCheck($(this));
        if($(this).is(':checked')) {
            $('#landingSubmit').val('Subscribe and Download');
        }
        else {
            $('#landingSubmit').val('Download');
        }
    });

    $('.js-checkbox').customCheckbox();

    $('#disqus_thread').bind('DOMNodeInserted DOMNodeRemoved', function() {
        $(this).css('padding', 16);
    });

    $('.js-expand').addClass('-expand');

    $('.js-categoryNav .hasSubmenu > a').click(function(e){
        e.preventDefault();
        $(this).siblings('.submenu').show();
    });

    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.js-toTop').addClass('-show');
        } else {
            $('.js-toTop').removeClass('-show');
        }
    });
    $('.js-toTop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    $('.gallery').featherlightGallery({
        gallery: {
            fadeIn: 300,
            fadeOut: 300
        },
        openSpeed:    300,
        closeSpeed:   300
    });

    jQuery('.js-content, .js-aside').theiaStickySidebar({
      // Settings
      additionalMarginTop: 80
    });

    $.featherlight.defaults.afterContent = function() {
        var caption = this.$currentTarget.find('img').attr('alt');
        this.$instance.find('.caption').remove();
        $('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
    }
    $.featherlight.defaults.beforeClose = function() {
        $('body').removeClass('model-open');
        $('body').css('padding-right', 0);
    };
    $.featherlight.defaults.afterOpen = function() {
        $('body').addClass('model-open');
        $('body').css('padding-right', 15);
    };

    $.featherlightGallery.prototype.afterContent = function() {
        var caption = this.$currentTarget.find('img').attr('alt');
        this.$instance.find('.caption').remove();
        $('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
    };

    if (!disable_adsense) {
        insertPostPageAdd();
    }

});


$.fn.customCheckbox = function() {

    $(this).hide();

    if($(this).is(':checked')) {
        $(this).before('<button class="c-checkbox js-checkboxTrigger" type="button" onclick="triggerCheck(this)"><span class="fa fa-check"></span></button>');
    }
    else {
        $(this).before('<button class="c-checkbox js-checkboxTrigger" type="button" onclick="triggerCheck(this)"></button>');
    }
}

function triggerCheck(e) {

    var checkbox = $(e).siblings('.js-checkbox');

    if(checkbox.is(':checked')) {
        checkbox.prop('checked', false);
        checkbox.trigger('change');
        $(e).empty();
    }
    else {
        checkbox.prop('checked', true);
        checkbox.trigger('change');
        $(e).append('<span class="fa fa-check"></span>');
    }
}

function insertPostPageAdd() {
    var ele = document.getElementById('postContent');
    if (ele != null) {
        var childCount = $(".b-postContent").children().length;
        var addUnitLarge = '<ins class="adsbygoogle b-addImage postpageAddUnit" style="display:none; width:728px; height:90px" data-ad-client="ca-pub-2839664859161137" data-ad-slot="3313112802"></ins>'
        var addUnitMedium = '<ins class="adsbygoogle" style="display:inline-block;width:468px;height:60px" data-ad-client="ca-pub-2839664859161137" data-ad-slot="2355280008"></ins>'
        var addUnitSmall = '<ins class="adsbygoogle" style="display:inline-block;width:320px;height:100px" data-ad-client="ca-pub-2839664859161137" data-ad-slot="3986790400"></ins>'
        var page_width = ele.getBoundingClientRect().width;

        if(childCount > 5) {
            if (page_width >= 728) {
                var addUnit = '<div align="center">' + addUnitLarge + '</div>'
            } else if(page_width >= 468){
                var addUnit = '<div align="center">' + addUnitMedium + '</div>'
            } else {
                var addUnit = '<div align="center">' + addUnitSmall + '</div>'
            }
            $(addUnit).insertAfter('.b-postContent > *:nth-child(4)');
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }
}

$.fn.customGallery = function() {
    var galleryWidth = $(this).find('.b-galleryImg').width();
    var galleryheight = galleryWidth * 0.6;
    $(this).find('.b-galleryImg').height(galleryheight);
    $(this).find('.b-galleryImg > img').height(galleryheight);
}

$(function() {
    // Add header-link class to all headers except h1 to produce header links.
    return $("h2, h3, h4, h5, h6").each(function(i, el) {
        var $el, icon, id;
        $el = $(el);
        id = $el.attr('id');
        icon = '<i class="fa fa-link"></i>';
        if (id) {
            return $el.prepend($("<a />").addClass("header-link").attr("href", "#" + id).html(icon));
        }
    });
});
