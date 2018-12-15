$(document).ready(function(){countItemsCross();if($('#crossselling_list_car').length&&!!$.prototype.bxSlider){crosseling_slider=$('#crossselling_list_car').bxSlider({minSlides:cross_carousel_items,maxSlides:cross_carousel_items,slideWidth:500,slideMargin:40,pager:false,nextText:'',prevText:'',moveSlides:1,infiniteLoop:false,hideControlOnEnd:true,responsive:true,useCSS:false,autoHover:false,speed:500,pause:3000,controls:true,autoControls:false});}});if(!isMobile){$(window).resize(function(){if($('#crossselling_list_car').length){resizeCarouselCross()}});}else{$(window).on("orientationchange",function(){var orientation_time;clearTimeout(orientation_time);orientation_time=setTimeout(function(){if($('#crossselling_list_car').length){resizeCarouselCross()}},500);});}
function resizeCarouselCross(){countItemsCross();crosseling_slider.reloadSlider({minSlides:cross_carousel_items,maxSlides:cross_carousel_items,slideWidth:500,slideMargin:40,pager:false,nextText:'',prevText:'',moveSlides:1,infiniteLoop:false,hideControlOnEnd:true,responsive:true,useCSS:false,autoHover:false,speed:500,pause:3000,controls:true,autoControls:false});}
function countItemsCross(){var crosssellingWidth=$('#crossselling').width();if(crosssellingWidth<390)
cross_carousel_items=1;if(crosssellingWidth>=390)
cross_carousel_items=2;if(crosssellingWidth>=680)
cross_carousel_items=3;if(crosssellingWidth>=970)
cross_carousel_items=4;if(crosssellingWidth>=1220)
cross_carousel_items=5;if(crosssellingWidth>=1460)
cross_carousel_items=6;}