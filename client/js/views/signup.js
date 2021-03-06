define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/user/signup.html"
],function($, Backbone, underscore, signupTemplate){
    var signupView = Backbone.View.extend({
        el: $("#content"), 
       
        events: {
            "submit #signup-form": "createUser"           
        },
       
        initialize: function(){
           this.render();
        },
       
        render: function(){
           this.$el.html(signupTemplate);
        }, 
       
        createUser: function(e){
           e.preventDefault();
           var username = $("#username").val().trim();
           var password = $("#password").val().trim();
            App.make_ajax_request(
                "/new/user", 
                "POST", 
                "json", 
                {username: username, password: password}, 
                function(response){
                   if(response.status == 400){
                        $("#error-handling").html(response.msg);
                   }else{
                        App.redirect_to("#login");   
                   }
                    
                },
                
                function(response){
                   $("#error-handling").html(response);
                }
            );
        }
    });
    
    return {
        initialize: function(){ 
            $("#content").undelegate("#signup-form", "submit");
            new signupView();
        }
    };
});