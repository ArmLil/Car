$(document).ready(function(){countItemsCategory();if($('#bxslider1').length&&!!$.prototype.bxSlider){productscategory_slider=$('#bxslider1').bxSlider({minSlides:category_carousel_items,maxSlides:category_carousel_items,slideWidth:500,slideMargin:40,pager:false,nextText:'',prevText:'',moveSlides:1,infiniteLoop:false,hideControlOnEnd:true,responsive:true,useCSS:false,autoHover:false,speed:500,pause:3000,controls:true,autoControls:false});}});if(!isMobile){$(window).resize(function(){if($('#bxslider1').length){resizeCarouselCategory()}});}else{$(window).on("orientationchange",function(){var orientation_time;clearTimeout(orientation_time);orientation_time=setTimeout(function(){if($('#bxslider1').length){resizeCarouselCategory()}},500);});}
function resizeCarouselCategory(){countItemsCategory();productscategory_slider.reloadSlider({minSlides:category_carousel_items,maxSlides:category_carousel_items,slideWidth:500,slideMargin:40,pager:false,nextText:'',prevText:'',moveSlides:1,infiniteLoop:false,hideControlOnEnd:true,responsive:true,useCSS:false,autoHover:false,speed:500,pause:3000,controls:true,autoControls:false});}
function countItemsCategory(){var productscategoryWidth=$('#productscategory_list').width();if(productscategoryWidth<390)
category_carousel_items=1;if(productscategoryWidth>=390)
category_carousel_items=2;if(productscategoryWidth>=680)
category_carousel_items=3;if(productscategoryWidth>=970)
category_carousel_items=4;if(productscategoryWidth>=1220)
category_carousel_items=5;if(productscategoryWidth>=1460)
category_carousel_items=6;}