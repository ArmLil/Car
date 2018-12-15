<?php
/* * * * * * * * * * * * * *
Social Kit - A Social Networking Platform
Copyright (c) 2014 Rehan Adil. All rights reserved.

@author Rehan Adil (MarvelKit)
@author_url http://codecanyon.net/user/MarvelKit
* * * * * * * * * * * * * */

error_reporting(1);
require_once('assets/includes/core.php');


if (!isset($_GET['tab1'])) {
    $_GET['tab1'] = 'home';
}

switch ($_GET['tab1']) {
    
    // Welcome page source
    case 'home':
        include('assets/sources/home.php');
        echo SK_getPage('container');
    break;
    


     default:
        echo SK_getPage('error');
        break;


    
}
//echo 1;
// If no sources found

mysqli_close($dbConnect);
exit();
