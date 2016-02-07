<?php
/**
 * Sage includes
 *
 * The $sage_includes array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 *
 * Please note that missing files will produce a fatal error.
 *
 * @link https://github.com/roots/sage/pull/1042
 */
$sage_includes = [
  'lib/assets.php',    // Scripts and stylesheets
  'lib/extras.php',    // Custom functions
  'lib/setup.php',     // Theme setup
  'lib/titles.php',    // Page titles
  'lib/wrapper.php',   // Theme wrapper class
  'lib/customizer.php', // Theme customizer
  'lib/wp_bootstrap_navwalker.php', // bootstrap nav walker
];

foreach ($sage_includes as $file) {
  if (!$filepath = locate_template($file)) {
    trigger_error(sprintf(__('Error locating %s for inclusion', 'sage'), $file), E_USER_ERROR);
  }

  require_once $filepath;
}
unset($file, $filepath);



//  // set action to get the cookie data
// function setCookieContents($logged_in_cookie)
// {
//     $cookieContents = array(
//         'logged_in_cookie'  =>  $logged_in_cookie,
//         'expire'            =>  $expire,
//         'expiration'        =>  $expiration,
//         'user_id'           =>  $user_id
//     );
//     print_r($_COOKIE);   //md5( $_SERVER['SERVER_NAME'] ) );
//     print_r($logged_in_cookie);
// }
// add_action('set_logged_in_cookie', 'setCookieContents');