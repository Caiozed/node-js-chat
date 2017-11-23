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
        }
    };

    $(document).ready(function(){
        router.initialize(); 
    });
});


