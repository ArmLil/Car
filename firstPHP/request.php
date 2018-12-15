<?php
/* * * * * * * * * * * * * *
Social Kit - A Social Networking Platform
Copyright (c) 2014 Rehan Adil. All rights reserved.

@author Rehan Adil (MarvelKit)
@author_url http://codecanyon.net/user/MarvelKit
* * * * * * * * * * * * * */

require_once('assets/includes/core.php');

$t = '';
$a = '';


if (isset($_REQUEST['t'])) {
    $t = SK_secureEncode($_REQUEST['t']);
}

if (isset($_REQUEST['a'])) {
    $a = SK_secureEncode($_REQUEST['a']);
}

$data = array(
    'status' => 417
);

require ("assets/includes/".$config['theme']."/request.php");





header("Content-type: application/json");
echo json_encode($data);
mysqli_close($dbConnect);
exit();
