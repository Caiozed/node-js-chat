require.config({
    paths: {
        "jquery"    : "js/libs/jquery.min",
        "backbone"  : "js/libs/backbone-min",
        "underscore": "js/libs/underscore-min",
        text        : "js/libs/text"
    },
    
    shims:{
        jquery: {
            exports: '$'  
        },

        underscore: {
            exports: '_'   
        },
        
        backbone:{
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }
});

require(["js/router", "jquery"], function(router, $){
    window.App = {
        redirect_to: function(url){
            window.location = url;
        },
        
        is_logged_in: function(){
            if(sessionStorage.user_id){
                return true;
            }else{
                return false;
            }
        },
        
        update_status: function(){
            if(this.is_logged_in()){
                $("#status").html("<a href='#logout'>Log out</a>");
            }else{
                $("#status").html("<a href='#login'>Log in</a>");
            }
        }
    };

    $(document).ready(function(){
        router.initialize(); 
    });
});


