<?php
/* * * * * * * * * * * * * *
Social Kit - A Social Networking Platform
Copyright (c) 2014 Rehan Adil. All rights reserved.

@author Rehan Adil (MarvelKit)
@author_url http://codecanyon.net/user/MarvelKit
* * * * * * * * * * * * * */

require_once('connect.php');
require_once('timezones.php');


function SK_isLogged() {
    global $dbConnect;
    return false;
}

function SK_isAdminLogged() {
    global $config;

    require_once('assets/settings/admin.php');

    if (!empty($_SESSION['admin_id']) && !empty($_SESSION['admin_password'])) {

        if ($_SESSION['admin_id'] == $config['admin_username'] && $_SESSION['admin_password'] == $config['admin_password']) {
            return true;
        }
    }


    return false;
}

function SK_secureEncode($string) {
    global $dbConnect;
    $string = trim($string);
    $string = mysqli_real_escape_string($dbConnect, $string);
    $string = htmlspecialchars($string, ENT_QUOTES);
    $string = str_replace('\\r\\n', '<br>',$string);
    $string = str_replace('\\r', '<br>',$string);
    $string = str_replace('\\n\\n', '<br>',$string);
    $string = str_replace('\\n', '<br>',$string);
    $string = str_replace('\\n', '<br>',$string);
    $string = stripslashes($string);
    $string = str_replace('&amp;#', '&#',$string);
    return $string;
}

function SK_getPage($page_url='') {
    global $sk, $lang,$time;
    
    $page = './themes/' . $sk['config']['theme'] . '/layout/' . $page_url . '.phtml';
    $page_content = '';
    
    ob_start();
    include($page);
    $page_content = ob_get_contents();
    ob_end_clean();
    
    return $page_content;
}

function SK_generateKey($minlength=5, $maxlength=5, $uselower=true, $useupper=true, $usenumbers=true, $usespecial=false) {
    $charset = '';
    
    if ($uselower) {
        $charset .= "abcdefghijklmnopqrstuvwxyz";
    }
    
    if ($useupper) {
        $charset .= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    
    if ($usenumbers) {
        $charset .= "123456789";
    }
    
    if ($usespecial) {
        $charset .= "~@#$%^*()_+-={}|][";
    }
    
    if ($minlength > $maxlength) {
        $length = mt_rand($maxlength, $minlength);
    } else {
        $length = mt_rand($minlength, $maxlength);
    }
    
    $key = '';
    
    for ($i = 0; $i < $length; $i++) {
        $key .= $charset[(mt_rand(0, strlen($charset) - 1))];
    }
    
    return $key;
}

function SK_registerMedia4($upload, $album_id=0, $types='') {


    global $dbConnect,$sk;
    set_time_limit(0);
    $site_url = $sk['config']['site_url'];

    if (!file_exists('photos/' . date('Y'))) {
        mkdir('photos/' . date('Y'), 0777, true);
    }

    if (!file_exists('photos/' . date('Y') . '/' . date('m'))) {
        mkdir('photos/' . date('Y') . '/' . date('m'), 0777, true);
    }

    $photo_dir = 'photos/' . date('Y') . '/' . date('m');

    if (is_uploaded_file($upload['tmp_name'])) {
        $upload['name'] = SK_secureEncode($upload['name']);
        $name = preg_replace('/([^A-Za-z0-9_\-\.]+)/i', '', $upload['name']);
        $ext = strtolower(substr($upload['name'], strrpos($upload['name'], '.') + 1, strlen($upload['name']) - strrpos($upload['name'], '.')));

        if ($upload['size'] > 1024) {

            if (preg_match('/(jpg|jpeg|png)/', $ext)) {

                list($width, $height) = getimagesize($upload['tmp_name']);

                $query_one = "INSERT INTO media (extension,name,type,site_url) VALUES ('$ext','$name','photo','$site_url')";
                $sql_query_one = mysqli_query($dbConnect, $query_one);

                if ($sql_query_one) {
                    $sql_id = mysqli_insert_id($dbConnect);
                    $original_file_name = $photo_dir . '/' . SK_generateKey() . '_' . $sql_id . '_' . md5($sql_id);
                    $original_file = $original_file_name . '.' . $ext;

                    if (move_uploaded_file($upload['tmp_name'], $original_file)) {
                        $min_size = $width;

                        if ($width > $height) {
                            $min_size = $height;
                        }

                        $min_size = floor($min_size);

                            if ($min_size > 920) {
                                $min_size = 920;
                            }




                        if($types == 'logo'){
                            SK_processMedia4('crop', $original_file_name,$ext, $min_size, $min_size,100);

                        }else{
                            //делаем из аригинала 100x100, thumb
                            SK_processMedia4('crop', $original_file_name,$ext, $min_size, $min_size,100);

//делаем из аригинала урезанный оригинал
                            SK_processMedia4('resize', $original_file_name,$ext, $min_size, 0,100);
                        }





                        //
                        mysqli_query($dbConnect, "UPDATE media SET album_id=$album_id,url='$original_file_name',temp=0,active=1 WHERE id=$sql_id");
                        $get = array(
                            'id' => $sql_id,
                            'active' => 1,
                            'extension' => $ext,
                            'name' => $name,
                            'url' => $original_file_name
                        );

                        return $get;
                    }
                }
            }
        }
    }
}

function SK_processMedia4($run, $photo_src, $ext, $width=0, $height=0, $quality=100) {
    global $sk;
    if (!is_numeric($quality) or $quality < 0 or $quality > 100) {
        $quality = 100;
    }

    if (file_exists($photo_src.'.'.$ext)) {



        if (preg_match('/(jpg|jpeg|png)/', $ext)) {
            list($photo_width, $photo_height) = getimagesize($photo_src.'.'.$ext);



            if ($run == "crop") {

                if ($width > 0 && $height > 0) {
                    $crop_width = $photo_width;
                    $crop_height = $photo_height;
                    $k_w = 1;
                    $k_h = 1;
                    $dst_x = 0;
                    $dst_y = 0;
                    $src_x = 0;
                    $src_y = 0;

                    if ($width == 0 or $width > $photo_width) {
                        $width = $photo_width;
                    }

                    if ($height == 0 or $height > $photo_height) {
                        $height = $photo_height;
                    }

                    $crop_width = $width;
                    $crop_height = $height;
                    if ($crop_width > $photo_width) {
                        $dst_x = ($crop_width - $photo_width) / 2;
                    }

                    if ($crop_height > $photo_height) {
                        $dst_y = ($crop_height - $photo_height) / 2;
                    }

                    if ($crop_width < $photo_width || $crop_height < $photo_height) {
                        $k_w = $crop_width / $photo_width;
                        $k_h = $crop_height / $photo_height;

                        if ($crop_height > $photo_height) {
                            $src_x  = ($photo_width - $crop_width) / 2;
                        } elseif ($crop_width > $photo_width) {
                            $src_y  = ($photo_height - $crop_height) / 2;
                        } else {

                            if ($k_h > $k_w) {
                                $src_x = round(($photo_width - ($crop_width / $k_h)) / 2);
                            } else {
                                $src_y = round(($photo_height - ($crop_height / $k_w)) / 2);
                            }
                        }
                    }



//_100x100

                    $s_image = new Imagick();
                    $s_image->readImage($photo_src.'.'.$ext);
                    $s_image->cropImage($crop_width,$crop_height,$src_x,$src_y);
                    $s_image->writeImage($photo_src. '_100x100.'.$ext);
                    $s_image->clear();
                    $s_image->destroy();

                    //_100x75
                    $crop_height_75 = $crop_height / 100 * 75;
                    $su_image = new Imagick();
                    $su_image->readImage($photo_src.'_100x100.'.$ext);
                    $su_image->cropImage($crop_width,$crop_height_75,100,75);
                    $su_image->writeImage($photo_src. '_100x75.'.$ext);
                    $su_image->clear();
                    $su_image->destroy();


//_100x100 resize

                    $s_image_resize = new Imagick();
                    $s_image_resize->readImage($photo_src. '_100x100.'.$ext);
                    $s_image_resize->resizeImage(270,270,Imagick::FILTER_LANCZOS,0.7);
                    $s_image_resize->writeImage($photo_src. '_100x100.'.$ext);
                    $s_image_resize->clear();
                    $s_image_resize->destroy();
//_100x75 resize
                    $h_75 = 270 * 0.75;
                    $s_image_resize_u = new Imagick();
                    $s_image_resize_u->readImage($photo_src. '_100x75.'.$ext);
                    $s_image_resize_u->resizeImage(270,$h_75,Imagick::FILTER_LANCZOS,0.7);
                    $s_image_resize_u->writeImage($photo_src. '_100x75.'.$ext);
                    $s_image_resize_u->clear();
                    $s_image_resize_u->destroy();





//_thumb 65x65
                    $thumb = new Imagick();
                    $thumb->readImage($photo_src. '_100x100.'.$ext);
                    $thumb->resizeImage(65,65,Imagick::FILTER_LANCZOS,0.5);
                    $thumb->writeImage($photo_src. '_thumb.'.$ext);
                    $thumb->clear();
                    $thumb->destroy();





                }
            } elseif ($run == "resize") {

                if ($width == 0 && $height == 0) {
                    return false;
                }

                if ($width > 0 && $height == 0) {
                    $resize_width = $width;
                    $resize_ratio = $resize_width / $photo_width;
                    $resize_height = floor($photo_height * $resize_ratio);
                } elseif ($width == 0 && $height > 0) {
                    $resize_height = $height;
                    $resize_ratio = $resize_height / $photo_height;
                    $resize_width = floor($photo_width * $resize_ratio);
                } elseif ($width > 0 && $height > 0) {
                    $resize_width = $width;
                    $resize_height = $height;
                }

                if ($resize_width > 0 && $resize_height > 0) {
                    $image = new Imagick();
                    $image->readImage($photo_src.'.'.$ext);
                    $image->resizeImage($resize_width,$resize_height,Imagick::FILTER_LANCZOS,0.85);
                    $image->writeImage($photo_src.'.'.$ext);
                    $image->clear();
                    $image->destroy();
                }
            } elseif ($run == "scale") {

                if ($width == 0) {
                    $width = 100;
                }

                if ($height == 0) {
                    $height = 100;
                }

                $scale_width = $photo_width * ($width / 100);
                $scale_height = $photo_height * ($height / 100);
                $scale_image= new Imagick();
                $scale_image->readImage($photo_src.'.'.$ext);
                $scale_image->resizeImage($scale_width,$scale_height,Imagick::FILTER_LANCZOS,0.5);
                $scale_image->writeImage($photo_src.'_scale.'.$ext);
                $scale_image->clear();
                $scale_image->destroy();
            }
        }
    }
}

function print_RR($var) { echo '<pre>'; print_r($var); echo '</pre>'; }

function SK_getMedia($file_id=0) {
    global $config, $dbConnect;

    if (is_numeric($file_id)) {
        $query = "SELECT * FROM media WHERE id=$file_id";
        $sql_query = mysqli_query($dbConnect, $query);

        if (mysqli_num_rows($sql_query) == 1) {
            $sql_fetch = mysqli_fetch_array($sql_query);
            //$sql_fetch['post_url'] = SK_smoothLink('index.php?tab1=post&post_id=' . $sql_fetch['post_id']);
            return $sql_fetch;
        }
    }
}




