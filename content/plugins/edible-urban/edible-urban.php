<?php

/*  Plugin Name: Edible Urban
    Plugin URI:
    Description: plug in to enable rest api for custom posts which have a geojson custom field, requires wp-rest-api plugin v2 and wordpress > 4.3
    Version: 0.0.2
    Author: Safety Cat
    Author URI: http://safetycat.co.uk/
    License: GPLv2
*/

/*  JAMES SMITH  (email : zz.james@gmail.com)
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
    // check for wp-api
    if(!is_plugin_active('rest-api/plugin.php')) {
        exit('you need the wp-api v2 plugin');
    }
}
register_activation_hook( __FILE__, 'edible_install' );

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



function register_fields() {
    // for geo json
    register_rest_field(
        EDIBLE_POST_TYPE,
        'map_data',
        array(
            'get_callback'    => 'get_geojson',
            'update_callback' => null,
            'schema'          => null,
        )
    );
    // for area type
    register_rest_field(
        EDIBLE_POST_TYPE,
        'area_type',
        array(
            'get_callback'    => 'get_areatype',
            'update_callback' => null,
            'schema'          => null,
        )
    );
    register_rest_field(
        EDIBLE_POST_TYPE,
        'image',
        array(
            'get_callback'    => 'get_postimageurl',
            'update_callback' => null,
            'schema'          => null,
        )
    );
    register_rest_field(
        EDIBLE_POST_TYPE,
        'suggested_uses',
        array(
            'get_callback'    => 'get_suggesteduses',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}
add_action( 'rest_api_init', 'register_fields' );



/**
 * Get the value of the geojson field
 *
 * @param array $object Details of current post.
 * @param string $field_name Name of field.
 * @param WP_REST_Request $request Current request
 *
 * @return mixed
 */
function get_geojson( $object, $field_name, $request ) {
    return json_decode(get_post_meta( $object[ 'id' ], $field_name, true ));
}

/**
 * Array $object Details of the current post.
 *
 * @param array $object Details of current post.
 * @param string $field_name Name of field.
 * @param WP_REST_Request $request Current request
 *
 * @return mixed            [description]
 */
function get_areatype( $object, $field_name, $request ) {
    if(get_the_terms( $object[ 'id' ], 'area-type' )[0]){
        return get_the_terms( $object[ 'id' ], 'area-type' )[0]->name;
    }
}

function get_postimageurl( $object, $field_name, $request ) {
    if( has_post_thumbnail( $object[ 'id' ] ) ) {
        $thumb = wp_get_attachment_image_src( $object[ 'featured_image' ] );
        return $thumb[0]; // we only allow one image
    }
}

function get_suggesteduses( $object, $field_name, $request ) {
    // this is slighly complex to gather the terms into an array
    $suggestedUsesTerms = get_the_terms( $object['id'], 'suggested-use' ); // this is an object

    $suggestedUses = array();
    if($suggestedUsesTerms) {
        foreach ($suggestedUsesTerms as $key => $term) {
            $suggestedUses[] = $term->name;
        }
    }
    $suggestedUses = json_encode($suggestedUses); //n.b. PHP 5.2 and above

    return $suggestedUses;
}


class EdibleUrban_API_Plot extends WP_REST_Posts_Controller  {
    /**
     * we use this register routes method to register the post
     * http://edibleurban/wp-json/edible_urban/v2/plots
     * endpoint which is /plot
     * @return [type] [description]
     */
    function register_routes() {
        $version = '2';
        $namespace = 'edible_urban/v' . $version;
        $base = EDIBLE_POST_TYPE;
        register_rest_route( $namespace, '/' . $base, array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this,'create_item'),
                'permission_callback' => array($this,'create_item_permissions_check'),
            ),
        ) );
    }

    /**
     * Create a single plot.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_Error|WP_REST_Response
     */
    function create_item( WP_REST_Request $request ) {
        if ( ! empty( $request['id'] ) ) {
            return new WP_Error( 'rest_post_exists', __( 'Cannot create existing post.' ), array( 'status' => 400 ) );
        }

        $post = $this->prepare_item_for_database( $request );
        if ( is_wp_error( $post ) ) {
            return $post;
        }

        $post_id = wp_insert_post( $post, true );
        if ( is_wp_error( $post_id ) ) {

            if ( in_array( $post_id->get_error_code(), array( 'db_insert_error' ) ) ) {
                $post_id->add_data( array( 'status' => 500 ) );
            } else {
                $post_id->add_data( array( 'status' => 400 ) );
            }
            return $post_id;
        }
        $post->ID = $post_id;

        // add geojson meta data
        add_post_meta($post_id, 'map_data', $request['geo_json'], true);

        // add the area type
        wp_set_object_terms( $post_id, $request['area_type'], 'area-type' );

        // add the suggested use types
        $suggestedUses = explode( ',' , $request['suggested_uses'] );
        wp_set_object_terms( $post_id, $suggestedUses, 'suggested-use' );

        if(isset($request['image'])) {
            set_post_thumbnail( $post_id, $request['image'] );
        }

        /**
         * Fires after a single post is created or updated via the REST API.
         *
         * @param object          $post      Inserted Post object (not a WP_Post object).
         * @param WP_REST_Request $request   Request object.
         * @param bool            $creating  True when creating post, false when updating.
         */
        do_action( 'rest_insert_post', $post, $request, true );

        $get_request = new WP_REST_Request;
        $get_request->set_param( 'id', $post_id );
        $get_request->set_param( 'context', 'edit' );
        $response = $this->get_item( $get_request );
        $response = rest_ensure_response( $response );
        $response->set_status( 201 );
        $response->header( 'Location', rest_url( '/wp/v2/' . $this->get_post_type_base( $post->post_type ) . '/' . $post_id ) );

        return $response;

    }





    /**
     * Check if a given request has access to create items
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    function create_item_permissions_check( $request ) {
        return current_user_can( 'edit_posts' );
    }
}
$edibleUrban_API_Plot = new EdibleUrban_API_Plot(EDIBLE_POST_TYPE);

add_action( 'rest_api_init', array($edibleUrban_API_Plot, 'register_routes') );