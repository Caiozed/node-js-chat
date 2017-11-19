define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/signup.html"
],function($, Backbone, underscore, signupTemplate){
    var signupView = Backbone.View.extend({
       el: $(".container"), 
       
       initialize: function(){
           this.render();
       },
       
       render: function(){
           this.$el.html(signupTemplate);
       }
    });
    
    return {initialize: function(){ new signupView()}};
});