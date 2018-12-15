$(document).ready(function(){countItemsRelated();if($('#tmrelatedproducts').length&&!!$.prototype.bxSlider){tmrelatedproducts_slider=$('#tmrelatedproducts').bxSlider({minSlides:related_carousel_items,maxSlides:related_carousel_items,slideWidth:500,slideMargin:40,pager:false,nextText:'',prevText:'',moveSlides:1,infiniteLoop:false,hideControlOnEnd:true,responsive:true,useCSS:false,autoHover:false,speed:500,pause:3000,controls:true,autoControls:false});}});if(!isMobile){$(window).resize(function(){if($('#tmrelatedproducts').length){resizeCarouselRelated()}});}else{$(window).on("orientationchange",function(){var orientation_time;clearTimeout(orientation_time);orientation_time=setTimeout(function(){if($('#tmrelatedproducts').length){resizeCarouselRelated()}},500);});}
function resizeCarouselRelated(){countItemsRelated();tmrelatedproducts_slider.reloadSlider({minSlides:related_carousel_items,maxSlides:related_carousel_items,slideWidth:500,slideMargin:40,pager:false,nextText:'',prevText:'',moveSlides:1,infiniteLoop:false,hideControlOnEnd:true,responsive:true,useCSS:false,autoHover:false,speed:500,pause:3000,controls:true,autoControls:false});}
function countItemsRelated(){var relatedBlockWidth=$('.related-block').width();if(relatedBlockWidth<390)
related_carousel_items=1;if(relatedBlockWidth>=390)
related_carousel_items=2;if(relatedBlockWidth>=680)
related_carousel_items=3;if(relatedBlockWidth>=970)
related_carousel_items=4;if(relatedBlockWidth>=1220)
related_carousel_items=5;if(relatedBlockWidth>=1460)
related_carousel_items=6;}