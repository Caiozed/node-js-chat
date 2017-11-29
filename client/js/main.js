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
        },
        
        make_ajax_request: function(url, method, dataType, data, successCallback, errorCallback){
            $.ajax({
                url: url,
                method: method,
                dataType: dataType,
                data: data,
                success: function(response){
                    successCallback(response);
                },
                
                error: function(response){
                    errorCallback(response);
                }
                
            });
        },
        
        is_member: function(chat_id, callback){
             this.make_ajax_request(
                 "/members", 
                 "POST", 
                 "json", 
                 {chat_id: chat_id}, 
                 function(response){
                    var result = response.filter(function(member){return member["id"]==sessionStorage.user_id}).length;
                                                console.log(result);
                    callback(result);
                },
                
                function(response){
                    console.log(response);
                }
            );
        }
    };

    $(document).ready(function(){
        router.initialize(); 
    });
});


