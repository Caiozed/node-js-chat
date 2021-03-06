define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/login.html"
], function($, Backbone, _, loginTemplate){
    var loginView = Backbone.View.extend({
        el: $("#content"),
       
        events: {
            "submit #login-form": "loginUser"           
        },
       
        initialize: function(){
            this.render(); 
        },
       
        render: function(){
           this.$el.html(loginTemplate);
        },
       
        loginUser: function(e){
           e.preventDefault();
           var username = $("#username").val().trim();
           var password = $("#password").val().trim();
           App.make_ajax_request(
                "/new/login", 
                "POST", 
                "json", 
                {username: username, password: password}, 
                function(response){
                    console.log(response);
                    if(response.results.length == 0){
                      $("#error-handling").html("<div class='alert alert-danger'>Wrong name or password!</div>");
                    }else{
                        var result = response.results[[0]];
                        sessionStorage.user_id = result.id;
                        sessionStorage.username = result.username;
                        App.redirect_to("#chats");
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
                $("#content").undelegate("#login-form", "submit");
                new loginView();
            }
        };
});