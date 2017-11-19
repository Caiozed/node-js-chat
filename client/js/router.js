define([
    "jquery",
    "backbone",
    "underscore",
    "js/views/index.js",
    "js/views/signup.js",
], function($, Backbone, _, indexView, signupView){
    var Router = Backbone.Router.extend({
       routes:{
           "": "index",
           "signup": "signup"
       },
       
       index: function(){
            indexView.initialize();  
       },
       
       signup: function(){
           signupView.initialize();
       }
    });
    
    return {
            initialize: function(){
                new Router();
                Backbone.history.start();
            }
        };
});