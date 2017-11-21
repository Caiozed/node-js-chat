define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/signup.html"
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
           $.ajax({
               url: "/signup",
               method: "POST",
               data: {username: username, password: password},
               success: function(response){
                    App.redirect_to("#login");
               },
               
               error: function(response){
                   $("#error-handling").html(response);
               }
           });
       }
    });
    
    return {initialize: function(){ new signupView()}};
});