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
           $.ajax({
               url: "/login",
               method: "POST",
               dataType: "json",
               data: {username: username, password: password},
               success: function(response){
                    console.log(response);
                    if(response.results.length == 0){
                      $("#error-handling").html("<div class='alert alert-danger'>Wrong name or password!</div>");
                    }else{
                        App.redirect_to(response.redirect);
                    }
               },
               
               error: function(response){
                   $("#error-handling").html(response);
               }
           });
       }
    });
    
    return {
            initialize: function(){
                new loginView();
            }
        };
});