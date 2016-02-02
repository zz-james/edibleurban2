if(!CONFIG.logged_in) {
    document.location.hash = "help-view";
}

$('#loginform').submit(function(e){

    var $elem = $(e.target);
    $elem.find('p.status').text('Sending user info, please wait...');
    var loginrequest = postLogin($elem);

    loginrequest.done(function(data){
        if(data.loggedin == true) {
            CONFIG.logged_in = true;
            addDrawControls(); // there needs to be a proper component api created
            document.location.hash = 'start-view';
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

    var data = {
        'action'    : 'ajaxlogin',
        'username'  : $form.find('#user_login').val(),
        'password'  : $form.find('#user_pass').val(),
        'remember'  : $form.find('#rememberme').val(),
        'security'  : $form.find('#security').val()
    };

    var loginrequest = $.ajax({
        type    : 'POST',
        dataType: 'json',
        url     : $form[0].action, // the url is in the action attribute of the form tag
        data    : data
    });

    return loginrequest;
}
