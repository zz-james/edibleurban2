if(!CONFIG.logged_in) {
    document.location.hash = "help-view";
}

$('#loginform').submit(function(e){

    var $elem = $(e.target);
    $elem.find('p.status').show().text('Sending user info, please wait...');
    var loginrequest = postLogin($elem);

    loginrequest.done(function(data){
        if(data.loggedin == true) {
            document.location.hash = '';
        }
    });

    loginrequest.fail(function(data){
        console.log('login network fail :-(');
    });

    e.preventDefault();
});

/**
 * post the user credentials to the ajax login end point
 * @param  {jquery} $form - jQuery object with the form
 * @return {jquery promise} loginrequest - jquery ajax xhr promise
 */
function postLogin($form) {
    var loginrequest = $.ajax({
        type    : 'POST',
        dataType: 'json',
        url     : 'http://edibleurban/wordpress/wp-admin/admin-ajax.php', //get from e.target.
        data    : {
            'action'    : 'ajaxlogin',
            'username'  : $('loginform #user_login').val(),
            'password'  : $('loginform #user_pass').val(),
            'security'  : $('loginform #user_login').val()
        },
    });
    return loginrequest;
}
