define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/index.html"
],function($, Backbone, underscore, indexTemplate){
    var indexView = Backbone.View.extend({
       el: $("#content"), 
       
       initialize: function(){
           this.render();
       },
       
       render: function(){
           this.$el.html(indexTemplate);
       }
    });
    
    return {initialize: function(){ new indexView()}};
});