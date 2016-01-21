<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>  
  <script type="text/javascript"> // this could move to a seperate file

  var $link = jQuery( 'link[rel="https://api.w.org/"]' );

  window.CONFIG = {
    api_url      : $link.attr( 'href' ),
    api_nonce    : "<?php echo wp_create_nonce('wp_json'); ?>",
    template_url : "<?php echo get_bloginfo('template_directory'); ?>",
    logged_in    : "<?php echo is_user_logged_in(); ?>",
    suggested_use: {'Green Space'    : '#96c25d', 'Indoor Space' : '#d28cba', 'Pavement or pedestrian area' : '#eac1c0', 'Public Space' : '#eaaf24', 'Rooftop' : '#aedce7', 'Tarmac' : '#f4cda3', 'Vacant Land' : '#858e93' }
  };

  </script>

</head>
