<?php use Roots\Sage\Titles; ?>

<div class="flex_container">
    <div id="info_container">

        <div id="help-view">
            <div>
                <div>
                    <h3><?= Titles\title(); ?></h3>
                </div>
                <div class="intro-text well">
                    <p>Currently, this page features an interactive and participatory map of the potential for urban agriculture in peterborough, UK. This will son be expanded to included other cities. The purpose of the map is to collected data on land availability in cities to grow&nbsp;food. For example, mapping rooftops, tarmac, vacant lots, underused grass, land around housing. Users can also suggest an alternative food producing use for these spaces.&nbsp;Most people think there isn’t any land available in cities to grow substantial food; this map aims to prove them wrong.</p>
                    <a class="btn btn-info" href="#login-view">
                        <span class="text"> Next</span>
                    </a>
                </div>
            </div>
        </div>

        <div id="enter-details-view">
            <div>
                <div class="page-header">
                    <h3>Enter Plot Details</h3>
                </div>
                <!-- the static view content, enhanceable with javascript -->
            </div>
        </div>

        <div id="land-type-view">
            <div>
                <div class="page-header">
                    <h3>Land Type</h3>
                </div>
                <!-- the static view content, enhanceable with javascript -->
            </div>
        </div>

        <div id="suggested-use-view">
            <div>
                <div class="page-header">
                    <h3>Suggested Use</h3>
                </div>
                <!-- the static view content, enhanceable with javascript -->
            </div>
        </div>

        <div id="display-view">
            <div>
                <div class="page-header">
                    <h3>Suggested Use</h3>
                </div>
                <!-- the static view content, enhanceable with javascript -->
            </div>
        </div>

        <div id="start-view">
            <div>
                <div>
                    <h3>Get Started</h3>
                </div>
                Use the <span class="leaflet-draw-toolbar"><a style="display: inline-block;width:32px;height:32px" class="leaflet-draw-draw-polygon"></a></span> icon to enable the drawing tool. Move to the point where you want to begin drawing your plot and click/tab to begin. 
            </div>
        </div>

        <div id="login-view">
            <div>
                <div>
                    <h3>Log In</h3>
                </div>
                <div class="intro-text well">
                    <p><strong>
                        If you wish to take part in adding to this map, please log in or
                        <a href="http://edibleurban/wordpress/wp-login.php?action=register">register</a> and get a password.
                        After this you can begin to draw on the map, adding land type, descriptions, and suggested
                        food producing uses.
                    </strong></p>

                    <div class="login">

                        <form name="loginform" id="loginform" method="post" action="<?php echo admin_url( 'admin-ajax.php' )?>">
                            <p class="status"></p>
                            <p>
                                <label for="user_login">Username<br>
                                <input type="text" name="log" id="user_login" class="input" value="" size="20"></label>
                            </p>
                            <p>
                                <label for="user_pass">Password<br>
                                <input type="password" name="pwd" id="user_pass" class="input" value="" size="20"></label>
                            </p>
                                <p class="forgetmenot">
                                <label for="rememberme">
                                    <input name="rememberme" type="checkbox" id="rememberme" value="forever"> Remember Me
                                </label>
                            </p>
                            <p class="submit">
                                <input type="submit" name="wp-submit" id="wp-submit" class="button button-primary button-large" value="Log In">
                            </p>
                            <?php wp_nonce_field( 'ajax-login-nonce','security' ); ?>
                        </form>

                        <p id="nav">
                        <a href="http://edibleurban/wordpress/wp-login.php?action=register">Register</a> |  <a href="<?php echo wp_lostpassword_url(); ?>" title="Password Lost and Found">Lost your password?</a>
                        </p>

                        <script type="text/javascript">
                            function wp_attempt_focus(){
                                setTimeout( function(){
                                    try{
                                            d = document.getElementById('user_login');
                                            d.focus();
                                            d.select();
                                        } catch(e){}
                                    }, 200);
                            }

                            wp_attempt_focus();
                        </script>
                    </div>
                </div>
            </div>
        </div>

        <div id="empty-view">
            <!-- hides the side bar -->
        </div>


    </div>

    <div id="map_container">
        <div id="map" style="height: 512px"></div>
    </div>
</div>