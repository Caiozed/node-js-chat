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
           $.ajax({
               url: "/new/user",
               method: "POST",
               dataType: "json",
               data: {username: username, password: password},
               success: function(response){
                   if(response.status == 400){
                        $("#error-handling").html(response.msg);
                   }else{
                        App.redirect_to("#login");   
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
            $("#content").undelegate("#signup-form", "submit");
            new signupView();
        }
    };
});