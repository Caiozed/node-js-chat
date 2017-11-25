define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/chat.html",
    "text!js/templates/members-partial.html",
    "text!js/templates/messages-partial.html"
], function($, Backbone, _, chatTemplate, membersPartialTemplate, messagesPartialTemplate){
    var chatView = Backbone.View.extend({
        el: $("#content"),
       
        events: {
            "click #send": "sendMessage",
            "keypress #message": "checkInput"
        },
        
        template: _.template(chatTemplate),
       
       initialize: function(){
            this.render(); 
       },
       
       render: function(){
           this.$el.html(this.template);
           this.getMembers();
           this.getMessages();
       },
       
       sendMessage: function(e){
            e.preventDefault();
            var that = this;
            var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            var msg = $("#message").text().trim();
            $.ajax({
                url: "/new/message",
                method: "POST",
                dataType: "json",
                data: {msg: msg, user_id: sessionStorage.user_id, chat_id: this.id, date: date},
                success: function(){
                    $("#message").text('');
                },
               
               error: function(response){
                   $("#error-handling").html(response);
               }
           });
           that.getMessages();
       },
       
       getMessages: function(){
            $.ajax({
                url: "/messages",
                method: "POST",
                dataType: "json",
                data: {chat_id: this.id},
                success: function(response){
                    console.log(response);
                    var temp = _.template(messagesPartialTemplate);
                    $(".message-list").html(temp({messages: response, _: _})); 
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
       },
       
       checkInput: function(){
           var text = $("#message").text();
           if(text.length >= 500){
                $("#message").text(text.substr(0, text.length - 1));
           }
       }
    });
    
    return {
            initialize: function(id){
                new chatView({id: id});
            }
        };
});