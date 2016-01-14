<?php

/*  Plugin Name: Edible Urban
    Plugin URI:
    Description: plug in to enable rest api for custom posts which have a geojson custom field, requires wp-rest-api plugin v2 and wordpress > 4.3
    Version: 0.0.2
    Author: Safety Cat
    Author URI: http://safetycat.co.uk/
    License: GPLv2
*/

/*  Copyright 2015  JAMES SMITH  (email : zz.james@gmail.com)
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once(ABSPATH . '../content/plugins/rest-api/plugin.php');

define( 'WP_APP_PLUGIN_URL',  plugins_url( '', __FILE__ ) );
define( 'WP_APP_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'EDIBLE_POST_TYPE',  'plots');  // change the name of the POST_TYPE here

/**
 * action executed when plugin is activated
 */
function edible_install() {
    // check for wp-api : to-do figure how to do this out later.
    is_plugin_active('json-rest-api');
}
// register_activation_hook( __FILE__, 'edible_install' );

/**
 * register a post type of plots
 * which has a custom field to contain
 * the geojson string
 */
function edible_register_post_types() {

  register_post_type( EDIBLE_POST_TYPE, array(
      'labels'      => array('name' => 'Plots'),
      'taxonomies'  => array( 'category' ),
      'public'      => true,
      'supports'    => array('title','editor','custom-fields','thumbnail')
    )
  );
}
add_action( 'init', 'edible_register_post_types' );


/**
 * register Custom Taxonomy
 */
function edible_createTaxonomies() {

    $labels = array(
        'name'                       => _x( 'Land Type', 'Taxonomy General Name', 'text_domain' ),
        'singular_name'              => _x( 'Land Type', 'Taxonomy Singular Name', 'text_domain' ),
        'menu_name'                  => __( 'Land Types', 'text_domain' ),
        'all_items'                  => __( 'Land Types', 'text_domain' ),
        'parent_item'                => __( 'Parent Type', 'text_domain' ),
        'parent_item_colon'          => __( 'Parent Type:', 'text_domain' ),
        'new_item_name'              => __( 'New Land Type', 'text_domain' ),
        'add_new_item'               => __( 'Add new Land Type', 'text_domain' ),
        'edit_item'                  => __( 'Edit Land Type', 'text_domain' ),
        'update_item'                => __( 'Update Land Type', 'text_domain' ),
        'view_item'                  => __( 'View Land Type', 'text_domain' ),
        'separate_items_with_commas' => __( 'Separate Land Types with commas', 'text_domain' ),
        'add_or_remove_items'        => __( 'Add or remove Land Type', 'text_domain' ),
        'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
        'popular_items'              => __( 'Popular Land Types', 'text_domain' ),
        'search_items'               => __( 'Search Land Types', 'text_domain' ),
        'not_found'                  => __( 'Land Type Not Found', 'text_domain' ),
    );
    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
    );
    register_taxonomy( 'area-type', array( EDIBLE_POST_TYPE ), $args );

    // ---------------------- //

    $labels = array(
        'name'                       => _x( 'Suggested Use', 'Taxonomy General Name', 'text_domain' ),
        'singular_name'              => _x( 'Suggested Use', 'Taxonomy Singular Name', 'text_domain' ),
        'menu_name'                  => __( 'Suggested Uses', 'text_domain' ),
        'all_items'                  => __( 'Suggested Uses', 'text_domain' ),
        'parent_item'                => __( 'Parent Type', 'text_domain' ),
        'parent_item_colon'          => __( 'Parent Type:', 'text_domain' ),
        'new_item_name'              => __( 'New Suggested Use', 'text_domain' ),
        'add_new_item'               => __( 'Add new Suggested Use', 'text_domain' ),
        'edit_item'                  => __( 'Edit Suggested Use', 'text_domain' ),
        'update_item'                => __( 'Update Suggested Use', 'text_domain' ),
        'view_item'                  => __( 'View Suggested Use', 'text_domain' ),
        'separate_items_with_commas' => __( 'Separate Suggested Uses with commas', 'text_domain' ),
        'add_or_remove_items'        => __( 'Add or remove Suggested Use', 'text_domain' ),
        'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
        'popular_items'              => __( 'Popular Suggested Uses', 'text_domain' ),
        'search_items'               => __( 'Search Suggested Uses', 'text_domain' ),
        'not_found'                  => __( 'Suggested Use Not Found', 'text_domain' ),
    );
    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
    );
    register_taxonomy( 'suggested-use', array( EDIBLE_POST_TYPE ), $args );
}
add_action( 'init', 'edible_createTaxonomies' );


/**
 * adds an endpoint and route for the custom post type PLOTS
 */
function edible_plotRestSupport() {
    global $wp_post_types;

    if( isset($wp_post_types[EDIBLE_POST_TYPE]) ) {
        $wp_post_types[EDIBLE_POST_TYPE]->show_in_rest = true;
        $wp_post_types[EDIBLE_POST_TYPE]->rest_base = EDIBLE_POST_TYPE;
        $wp_post_types[EDIBLE_POST_TYPE]->rest_controller_class = 'WP_REST_Posts_Controller';
    }
}
add_action( 'init', 'edible_plotRestSupport');
