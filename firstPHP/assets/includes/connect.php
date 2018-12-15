<?php
session_cache_limiter('none');
session_start();

// Include 'config.php' file
require('assets/includes/config.php');

// Connect to SQL Server
$dbConnect = mysqli_connect($sql_host, $sql_user, $sql_pass, $sql_name);

// Check connection
if (mysqli_connect_errno($dbConnect)) {
    exit(mysqli_connect_error());
}

// Assign database table names to constants
require('tables.php');

// Fetch site configurations
//require('assets/settings/general.php');
require('assets/settings/theme.php');
//require('assets/settings/ads.php');
$config['site_url'] = $site_url;
$config['theme_url'] = $site_url . '/themes/' . $config['theme'];
$config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
$config['ajax_path'] = $config['script_path'] . 'request.php';
$config['page_path'] = $config['script_path'] . 'page.php';



//include_once('themes/' . $config['theme'] . '/emoticons/process.php');

// Stores site configurations to variables for later use
$sk = array();

$settings = mysqli_fetch_array(mysqli_query($dbConnect, "SELECT * FROM settings WHERE id = 1"));
$config = array_merge($settings,$config);
$sk['config'] = $config;

// Login verification and user stats update
$logged = false;
$user = null;



$sk['logged'] = $logged;



// Removes session and unnecessary variables if user verification fails
if ($logged == false) {
    unset($_SESSION['user_id']);
    unset($user);
}
$time = time();