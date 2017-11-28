define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/chat-list.html",
    "text!js/templates/chat-partial.html"
], function($, Backbone, _, chatListTemplate, chatPartialTemplate){
    var chatListView = Backbone.View.extend({
        el: $("#content"),
        template: _.template(chatListTemplate),
        events: {
            "submit #chat-form": "createChat",
            "click #become_member": "createMember"
        },
       
       initialize: function(){
            this.render(); 
       },
       
       render: function(){
            this.$el.html(this.template);
            this.getChats();
       },
       
       getChats: function(){
          $(".chat-list").html("");
          var that = this;
           $.ajax({
                url: "/chats",
                method: "POST",
                dataType: "json",
                success: function(response){
                    $.each(response, function(key, chat){
                        that.addChat(chat); 
                    });
                },
               
               error: function(response){
                   $("#error-handling").html(response);
               }
           });
       },
       
       addChat: function(chat){
           var temp = _.template(chatPartialTemplate);
            $(".chat-list").append(temp(chat)); 
       },
       
       createChat: function(e){
           var that = this;
           e.preventDefault();
            var name = $("#name").val().trim();
            var description = $("#description").val().trim();
            var user_id = sessionStorage.user_id;
            $.ajax({
                url: "/new/chat",
                method: "POST",
                dataType: "json",
                data: {name: name, description: description, user_id: user_id},
                success: function(response){
                    if(response.status==400){
                        $("#error-handling").html(response.msg);
                    }else{
                        $("#name").val("");
                        $("#description").val("");
                        that.getChats();
                        $("#error-handling").html(response.msg);  
                    }
                },
               
               error: function(response){
                   $(".chat-list").prepend(response);
               }
           });
       },
       
       createMember: function(e){
           var that = this;
           console.log("in");
           e.preventDefault();
            var chat_id = $(e.currentTarget).data("chat_id");
            var user_id = sessionStorage.user_id;
            console.log(chat_id,user_id);
            $.ajax({
                url: "/new/member",
                method: "POST",
                dataType: "json",
                data: {chat_id: chat_id, user_id: user_id},
                success: function(response){
                    if(response.status==400){
                        $(".alert").remove();
                        $(e.currentTarget).parent(".chat").prepend(response.msg);
                        $(e.currentTarget).addClass("already-member");
                    }else{
                        that.getChats();
                        $("#error-handling").html(response.msg);  
                    }
                },
               
               error: function(response){
                   $(".chat-list").prepend(response);
               }
           });
       }
    });
    
    return {
            initialize: function(){
                $("#content").undelegate("#become_member", "click");
                $("#content").undelegate("#chat-form", "submit");
                new chatListView();
            }
        };
});