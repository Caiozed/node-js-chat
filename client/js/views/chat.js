define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/chat.html"
], function($, Backbone, _, chatTemplate){
    var chatView = Backbone.View.extend({
        el: $("#content"),
       
        events: {
            "click #send": "sendMessage"           
        },
       
       initialize: function(){
            this.render(); 
       },
       
       render: function(){
           this.$el.html({});
       },
       
       sendMessage: function(e){
            e.preventDefault();
            var msg = $("#message").val().trim();
            $.ajax({
                url: "/new/message",
                method: "POST",
                dataType: "json",
                data: {msg: msg, user_id: sessionStorage.user_id, chat_id: this.id},
                success: function(response){
                    console.log(response);
                    $(".chat").append("<p class='message'>"+msg+"</p>");
                },
               
               error: function(response){
                   $("#error-handling").html(response);
               }
           });
       }
    });
    
    return {
            initialize: function(id){
                new chatView({id: id});
            }
        };
});