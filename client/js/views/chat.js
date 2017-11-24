define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/chat.html",
    "text!js/templates/members-partial.html"
], function($, Backbone, _, chatTemplate, membersPartialTemplate){
    var chatView = Backbone.View.extend({
        el: $("#content"),
       
        events: {
            "click #send": "sendMessage"           
        },
        
        template: _.template(chatTemplate),
       
       initialize: function(){
            this.render(); 
       },
       
       render: function(){
           this.$el.html(this.template);
           this.getMembers();
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
                    $(".chat").append("<p class='message'>"+msg+"</p>");
                },
               
               error: function(response){
                   $("#error-handling").html(response);
               }
           });
       },
       
       getMembers: function(){
           $.ajax({
                url: "/members",
                method: "POST",
                dataType: "json",
                data: {chat_id: this.id},
                success: function(response){
                    var temp = _.template(membersPartialTemplate);
                    $(".online-users").append(temp({members: response, _: _}));  
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