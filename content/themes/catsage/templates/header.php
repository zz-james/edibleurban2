<header class="banner">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <a class="brand" href="<?= esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
        
      </div>
      <div class="col-md-6">
        <nav class="nav-primary navbar-default">
          <?php
          if (has_nav_menu('primary_navigation')) :
            wp_nav_menu(['theme_location' => 'primary_navigation', 'walker' => new wp_bootstrap_navwalker(), 'menu_class' => 'nav navbar-nav', 'container_class' => 'primary_nav']);
          endif;
          ?>
        </nav>
      </div>
    </div>

    <h2 class="sitedesc"><?php echo get_bloginfo('description') ?></h2>
    
  </div>
</header>