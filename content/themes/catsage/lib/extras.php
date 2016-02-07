<?php

namespace Roots\Sage\Extras;

use Roots\Sage\Setup;

/**
 * Add <body> classes
 */
function body_class($classes) {
  // Add page slug if it doesn't exist
  if (is_single() || is_page() && !is_front_page()) {
    if (!in_array(basename(get_permalink()), $classes)) {
      $classes[] = basename(get_permalink());
    }
  }

  // Add class if sidebar is active
  if (Setup\display_sidebar()) {
    $classes[] = 'sidebar-primary';
  }

  return $classes;
}
add_filter('body_class', __NAMESPACE__ . '\\body_class');

/**
 * Clean up the_excerpt()
 */
function excerpt_more() {
  return ' &hellip; <a href="' . get_permalink() . '">' . __('Continued', 'sage') . '</a>';
}
add_filter('excerpt_more', __NAMESPACE__ . '\\excerpt_more');

/**
 * verify front end ajax based login
 */
function ajax_login() {
  check_ajax_referer( 'ajax-login-nonce', 'security' );   // first check the nonce, if it fails the function will break

  // get the POST data and try sign the user on
  $info                  = array();
  $info['user_login']    = $_POST['username'];
  $info['user_password'] = $_POST['password'];
  $info['remember']      = $_POST['remember'];



  $user_signon = wp_signon( $info, false );

  if( is_wp_error( $user_signon )) {
    echo json_encode(array('loggedin' => false, 'message' => "Wrong username or password"));
  } else {
    echo json_encode(array('loggedin' => true, 'message' => "Login successful"));
  }
  die();
}
add_action( 'wp_ajax_nopriv_ajaxlogin', __NAMESPACE__ . '\\ajax_login' );





// do_action('set_logged_in_cookie', $logged_in_cookie, $expire, $expiration, $user_id, 'logged_in');





