<?php use Roots\Sage\Titles; ?>

<div class="flex_container">
    <div id="info_container">


<!-- help view -->


        <div id="help-view">
            <div>
                <div>
                    <h3><?= Titles\title(); ?></h3>
                </div>
                <div class="intro-text well">
                    <p>Currently, this page features an interactive and participatory map of the potential for urban agriculture 
                    in peterborough, UK. This will son be expanded to included other cities. The purpose of the map is to collected
                     data on land availability in cities to grow&nbsp;food. For example, mapping rooftops, tarmac, vacant lots, 
                     underused grass, land around housing. Users can also suggest an alternative food producing use for these 
                     spaces.&nbsp;Most people think there isn’t any land available in cities to grow substantial food; this map 
                     aims to prove them wrong.</p>
                    <a  class="btn btn-info"
                        href="#login-view"
                        onclick="store.dispatch( { type:'SIDEBAR_VIEW', view:'login' }); return false;" >
                        <span class="text"> Next</span>
                    </a>
                </div>
            </div>
        </div>


<!-- login view -->


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


<!-- get started view -->


        <div id="start-view">
            <div>
                <div>
                    <h3>Get Started</h3>
                </div>
                Use the <span class="leaflet-draw-toolbar"><a style="display: inline-block;width:32px;height:32px" class="leaflet-draw-draw-polygon"></a></span> icon to enable the drawing tool. Move to the point where you want to begin drawing your plot and click/tab to begin. 
            </div>
        </div>


<!-- display info view -->


        <div id="display-view">
            <div>
                <div>
                    <img class='plot-image' />
                    <h3 class='plot-title'></h3>
                </div>
                <div class="plot-content">
                </div>
                <span>Area Type: </span><span class="plot-area-type"></span><br />
                <span>Suggest Use: </span><span class="plot-suggested-use"></span>
            </div>
        </div>


<!-- enter details view -->


        <div id="enter-details-view">
            <div>
                <form id="detailsForm"><!-- exposes to controller via name attribute -->
                    <fieldset>
                        <legend>Enter Plot Details:</legend>
                        <div class="form-group">
                            <label for="plotTitle" class="control-label">Plot Name:</label>
                            <input
                              type        = "text"
                              class       = "form-control"
                              id          = "plotTitle"
                              name        = "plotTitle">
                        </div>

                        <div class="form-group">
                            <label for="plotBody" class="control-label">Plot Details:</label>
                            <textarea
                              class="form-control"
                              style="height:100px"
                              id="plotBody"
                              name="plotBody"></textarea>
                        </div>

                        <!-- file input group -->
                        <label for="fileupload" class="control-label">Image (not required):</label>
                        <div class="input-group">
                            <span class="input-group-btn">
                                <input type="file" multiple id="fileupload" name="fileupload">
                            </span>
                        </div>
                    </fieldset>
                    <br />
                    <fieldset>
                      <legend>Area Types:</legend>
                      <div class="form-group">
                        <select id="areaType" name="areaType">
                        <!-- loop to print the terms -->
                        <?php $terms = get_terms( "area-type", array( 'hide_empty' => 0 ) ); ?><!-- radio buttons for land type -->
                            <option value="Unknown">None Selected</option>
                        <?php foreach($terms as $index => $term): ?>
                            <option value="<?php echo $term->name;?>"><?php echo $term->name;?></option>
                        <?php endforeach; ?>
                        <!-- end loop to print the terms -->
                        </select>
                      </div>
                    </fieldset>
                    <br />
                    <fieldset>
                      <legend>Suggested Uses:</legend>
                      <div class="form-group">
                        <select id="suggestedUse" name="suggestedUse" multiple="multiple">
                        <!-- loop to print the terms -->
                        <?php $terms = get_terms( "suggested-use", array( 'hide_empty' => 0 ) ); ?> <!-- checkboxes for suggested use -->
                        <?php foreach($terms as $index => $term): ?>
                           <option value="<?php echo $term->name;?>"><?php echo $term->name;?></option>
                        <?php endforeach; ?>
                        <!-- end loop to print the terms -->
                        </select>
                      </div>
                    </fieldset>
                </form>

                <button
                    type  = "button"
                    class = "btn btn-primary save-details">Save Details</button>
            </div>
        </div><!-- close #enter-details-view -->

<!-- waiting view -->

        <div id="waiting-view">
            <img src="https://i.imgur.com/HmzkFcx.gif" />
            <center>Please Wait...</center>
        </div>

<!-- empty view -->

        <div id="empty-view">
            <!-- hides the side bar -->
        </div>
    </div>


<!-- map -->
    <div id="map_container">
        <div id="map"></div>
    </div>


</div>