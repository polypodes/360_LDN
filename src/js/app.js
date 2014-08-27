var actualpano = "pano1";

if ( Modernizr.touch ) { 
	$('.fs_desktop').remove();
}else{
	$('.fs_touch').remove();
}

// *********
// DETECT IE
// *********

function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // other browser
    return false;
}
var IE = detectIE();

if(parseInt(IE)<=8){
	$('body').addClass('ie');
}

// **********
// DETECT IOS
// **********

if (Modernizr.isios) {
    $('body').addClass('ios');
}

// **************
// GENERIC EVENTS
// **************

if(!IE){

	$(".menu__button")
	  .hammer({})
	  .on("touch", function(ev) {
	  	if($('body').hasClass('opened')){
			$('body').removeClass('opened');
		}else{
			$('body').addClass('opened');
		}
	  });


	$("#pano").hammer({})
		.on('touch',function(){
			$('body').removeClass('opened');
		});

}else{

	$(".menu__button").on("click", function(ev) {
	  	if($('body').hasClass('opened')){
			$('body').removeClass('opened');
		}else{
			$('body').addClass('opened');
		}
	  });


	$("#pano").on('click',function(){
			$('body').removeClass('opened');
		});

}

$('.fs_desktop').on('click',function(){
	$(document).toggleFullScreen();
});

// ******
// KRPANO
// ******

var viewer = embedpano({swf:"viewer/krpano.swf", xml:"xml/pano1.xml", target:"pano", html5:"prefer", passQueryParameters:true});
var krpano = document.getElementById("krpanoSWFObject");

// **********
// LOAD PANOS
// **********

var panosTitles = {
	'pano1':
		{
			title:"Vue panoramique",
			ltx:0,
			lty:0
		},
	'pano2':
		{
			title:"Exterieur",
			ltx:190,
			lty:0
		},
	'pano3':
		{
			title:"Salle de classe",
			ltx:-40,
			lty:0
		},
	'pano4':
		{
			title:"Salle de sport",
			ltx:-120,
			lty:0
		}
};

function loadpano(xmlname,ltx,lty)
{
	if(actualpano==xmlname)
		return false;
	
	$('.pano_item').removeClass('active');
	$('.pano_item.'+xmlname).addClass('active');

	actualpano=xmlname;
	if(!$('html').hasClass('no-touch'))
		$('body').removeClass('opened');

	
	$('.titleview').text(panosTitles[xmlname].title);
	// Move the sidebar
	// $('.menu__button').trigger('click')
	krpano.call("loadpano(" + xmlname + ".xml, null, MERGE, BLEND(0.8));");
	if(xmlname!="pano1")
		krpano.call("lookto("+panosTitles[xmlname].ltx+","+panosTitles[xmlname].lty+",100,tween(easeOutQuad,3),true,true)");
}

$('.pano_item').on('click',function(){
	// Load the pani
	loadpano($(this).attr('data-pano'));
})

// Function called from XML
function changeSpot(name){
	loadpano(name)
}

// *****
// VIDEO
// *****

var player = videojs('introvideo',{ "controls": true, "autoplay": true, "preload": "auto" });

function stopVideo(){
	player.currentTime(999);
	player.pause();
	$('body').addClass('videofinished');
	setTimeout(function(){
		$('.videopresentation').css("display","none");
	},400);
}

player.on('ended',function(){
	stopVideo();
});

$('.skip').on('click',function(){
	stopVideo();
})

$(".sidebar__panoslist__item.video").on("click",function(){
	$('.videopresentation').css("display","block");
	$('body').removeClass('videofinished');
	player.currentTime(0);
	player.play();
});

stopVideo();