define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/index.html"
],function($, Backbone, _, indexTemplate){
    var indexView = Backbone.View.extend({
       el: $("#content"), 
       
       template: _.template(indexTemplate),
       
       initialize: function(){
           this.render();
       },
       
       render: function(){
           this.$el.html(this.template({user_id: sessionStorage.user_id}));
       }
    });
    
    return {initialize: function(){ new indexView()}};
});