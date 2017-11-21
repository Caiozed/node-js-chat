define([
    "jquery",
    "backbone",
    "underscore",
    "js/views/index.js",
    "js/views/signup.js",
    "js/views/login.js"
], function($, Backbone, _, indexView, signupView, loginView){
    var Router = Backbone.Router.extend({
       routes:{
           "": "index",
           "signup": "signup",
           "login": "login"
       },
       
       index: function(){
            indexView.initialize();  
       },
       
       signup: function(){
           signupView.initialize();
       },
       
       login: function(){
           loginView.initialize();
       }
    });
    
    return {
            initialize: function(){
                new Router();
                Backbone.history.start();
            }
        };
});