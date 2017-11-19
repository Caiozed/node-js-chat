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
    $(document).ready(function(){
        router.initialize();    
    });
});

