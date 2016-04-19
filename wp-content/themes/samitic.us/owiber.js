jQuery.fn.supersleight = function(settings) {
	settings = jQuery.extend({
		imgs: true,
		backgrounds: true,
		shim: '/wp-content/themes/owiber/images/x.gif',
		apply_positioning: true
	}, settings);
	
	return this.each(function(){
		if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 7 && parseInt(jQuery.browser.version) > 4) {
			jQuery(this).find('*').each(function(i,obj) {
				var self = jQuery(obj);
				// background pngs
				if (settings.backgrounds && self.css('background-image').match(/\.png/i) !== null) {
					var bg = self.css('background-image');
					var src = bg.substring(5,bg.length-2);
					var mode = (self.css('background-repeat') == 'no-repeat' ? 'crop' : 'scale');
					var styles = {
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='" + mode + "')",
						'background-image': 'url('+settings.shim+')'
					};
					self.css(styles);
				};
				// image elements
				if (settings.imgs && self.is('img[src$=png]')){
					var styles = {
						'width': self.width() + 'px',
						'height': self.height() + 'px',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + self.attr('src') + "', sizingMethod='scale')"
					};
					self.css(styles).attr('src', settings.shim);
				};
				// apply position to 'active' elements
				if (settings.applyPositioning && self.is('a, input') && self.css('position') === ''){
					self.css('position', 'relative');
				};
			});
		};
	});
};

var swapperImage = null;
var scrollBack = 0;
var bigImagesCache = [];
var canSwap = null;

function owSwapImage(url) {
    canSwap = url;
    $('#imageswapper').hide().empty();
    $('#loader').show();

    if ( bigImagesCache[url] ) {
        owDoSwap(bigImagesCache[url]);
    }
    else {
        owTrackEvent('flickr','getBig', url, 0);
        var regex = new RegExp('^http.*\/([0-9]+)\/$');
        var photoidMatch = regex.exec(url);  
        var photoid = photoidMatch ? photoidMatch[1] : null; 
        
        if ( photoid != null ) {
            $.getJSON('http://api.flickr.com/services/rest/?api_key=3804f68f8f14be1d1b1ce0d2a78bb6ab&format=json&jsoncallback=?', { method : 'flickr.photos.getSizes', photo_id : photoid}, function (data) {
                var bigOne = null;
                if ( data.sizes && data.sizes.size) {
                    for ( var i = 0; i < data.sizes.size.length; i++) {
                        if ( bigOne == null && data.sizes.size[i].label == "Original" ) {
                            bigOne = data.sizes.size[i].source;
                        }
                        if ( data.sizes.size[i].label == "Large" ) {
                            bigOne = data.sizes.size[i].source;
                        }
                    }
                }
                if ( bigOne != null ) {
                    bigImagesCache[url] = bigOne;
                    if ( url == canSwap ) {
                        owDoSwap(bigImagesCache[url]);
                    }
                }
            });
        }
    }
}

function owDoSwap(url) {
    swapperImage = new Image();
    $(swapperImage).bind("load", owImageOnLoad).attr('src', url);
}

function owImageOnLoad() {
    $('#loader').hide();
    $('#imageswapper').append(this);
    //$(this).css('height','auto').css('width','auto');
    if ( $(this).attr('height') > $(this).attr('width') ) {
        var height = 683;
        var width = Math.round( (height / $(this).attr('height')) * $(this).attr('width'));
        $(this).attr('height', height).attr('width', width);
        if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 7) {
            $('#imageswapper img').css('-ms-interpolation-mode:bicubic;');
        }
        if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 7) {
            var styles = {
                'width': width + 'px',
                'height': height + 'px',
                'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + $(this).attr('src') + "', sizingMethod='scale')"
            };
            self.css(styles).attr('src', '/wp-content/themes/owiber/images/x.gif');
        }
    }
    $('#imageswapper').fadeIn("fast");
}
    
function owSwapImage2(url) {
    owTrackEvent('OWJS', 'zoomImage', url, 0);
    owSwapImage(url);
    scrollBack = $(window).scrollTop();
    $('html,body').animate({scrollTop: 0}, 250, null, function () {
        $('#scrollback').show();
        $('#imageswapper').css('cursor','pointer').bind("click", owScrollBack);
        $('#scrollback').supersleight();
        $('#scrollback img').effect("bounce", { times: 2, distance: 15 }, 400);
    });
}

function owTrackEvent(category, action, label, value) {
    try {
        pageTracker._trackEvent(category, action, label, value);
        console.log(category, action, label, value);
    } catch (e) {
        if (typeof(console) != 'undefined') {
            console.log(e);
        }
    }
}

function owScrollBack() {
    owTrackEvent('OWJS', 'jumpBack', '', 0);
    $('html,body').animate({scrollTop: scrollBack}, 250);
    $('#scrollback').hide();
    $('#imageswapper').unbind("click");
    owUnswap();
}

function owUnswap() {
    canSwap = null;
    var owIS = $('#imageswapper');
    owIS.css('cursor','auto');
    $(swapperImage).unbind("load");
    swapperImage = null;
    $('#loader').hide();
    owIS.empty();
    $('.flickr img').removeClass('faded');
    owIS.fadeOut("fast");
}

$(document).ready(function() {

    if (jQuery.browser.msie) {
        if (parseInt(jQuery.browser.version) == 6) {
            alert("You are using IE6, the bane of the internet.  Please upgrade or browse at your own risk.");
        }
    }
    
    if (window.location.href.length > 'http://www.owiber.com/'.length &&
        window.location.hash == "") {
        if ( $('body').scrollTop() == 0 ) {
            $('html,body').animate({scrollTop: 555}, 100);
        }
   }

    $('.flickr img').mouseenter(function() {
        var parentAhref = $(this).parent('a').attr('href');
        owTrackEvent('OWJS', 'hoverImage', parentAhref, 0);
        $('.flickr img').addClass('faded');
        owSwapImage(parentAhref);
    });

    $('.flickr img').mouseleave(function() {
        owUnswap();
    });
    
    $('#content a[href^="http://www.flickr.com/"], #content a[href^="http://flickr.com/"]').children('img[src*="flickr.com/"]').each(function () {
        var upArrow = $('#uparrow').html();
        $(this).parent('a').each(function () { $(this).after('<a class="flickrup" onclick="owSwapImage2(\'' + $(this).attr('href') + '\'); return false;" href="#">' + upArrow + '</a>'); });
    });
    
    $('body').supersleight();

});
