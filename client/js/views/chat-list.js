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
            "click #become_member": "createMember",
            "click #delete_chat": "deleteChat",
            "click #cancel_membership": "deleteMember"
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
            App.make_ajax_request(
                "/chats", 
                "POST", 
                "json", 
                {chat_id: this.id}, 
                function(response){
                    $.each(response, function(key, chat){
                        App.is_member(chat.id,
                        function(result){
                            that.addChat(chat, result); 
                        });
                    });
                },
                
                function(response){
                   $("#error-handling").html(response);
                }
            );
        },
       
        addChat: function(chat, is_member){
           var temp = _.template(chatPartialTemplate);
            $(".chat-list").append(temp({chat: chat, is_member: is_member})); 
        },
       
        createChat: function(e){
            var that = this;
            e.preventDefault();
            var name = $("#name").val().trim();
            var description = $("#description").val().trim();
            var user_id = sessionStorage.user_id;
            App.make_ajax_request(
                "/new/chat", 
                "POST", 
                "json", 
                {name: name, description: description, user_id: user_id}, 
                function(response){
                    if(response.status==400){
                        $("#error-handling").html(response.msg);
                    }else{
                        $("#name").val("");
                        $("#description").val("");
                        that.getChats();
                        $("#error-handling").html(response.msg);  
                    }
                },
                
                function(response){
                   $(".chat-list").prepend(response);
                }
            );
        },
       
        createMember: function(e){
            var that = this;
            e.preventDefault();
            var chat_id = $(e.currentTarget).data("chat_id");
            var user_id = sessionStorage.user_id;
            App.make_ajax_request(
                "/new/member", 
                "POST", 
                "json", 
                {chat_id: chat_id, user_id: user_id}, 
                function(response){
                    if(response.status==400){
                        $(".alert").remove();
                        $(e.currentTarget).parent(".chat").prepend(response.msg);
                        $(e.currentTarget).addClass("already-member");
                    }else{
                        that.getChats();
                        $("#error-handling").html(response.msg);  
                    }
                },
                
                function(response){
                   $(".chat-list").prepend(response);
                }
            );
        },
       
        deleteChat: function(e){
            var that = this;
            e.preventDefault();
            var chat_id = $(e.currentTarget).data("chat_id");
            var user_id = sessionStorage.user_id;
            App.make_ajax_request(
                "/delete/chat/"+chat_id, 
                "POST", 
                "json", 
                {chat_id: chat_id, user_id: user_id}, 
                function(response){
                    if(response.status==400){
                        $(".alert").remove();
                        $(e.currentTarget).parent(".chat").prepend(response.msg);
                        $(e.currentTarget).addClass("already-member");
                    }else{
                        that.getChats();
                        $("#error-handling").html(response.msg);  
                    }
                },
                
                function(response){
                   $(".chat-list").prepend(response);
               }
            );
        },
        
        deleteMember: function(e){
            var that = this;
            e.preventDefault();
            var chat_id = $(e.currentTarget).data("chat_id");
            var user_id = sessionStorage.user_id;
            App.make_ajax_request(
                "/delete/member", 
                "POST", 
                "json", 
                {chat_id: chat_id, user_id: user_id}, 
                function(response){
                    if(response.status==400){
                        $(".alert").remove();
                        $(e.currentTarget).parent(".chat").prepend(response.msg);
                    }else{
                        that.getChats();
                    }
                },
                
                function(response){
                   $(".chat-list").prepend(response);
                }
            );
        }
    });
    
    return {
            initialize: function(){
                $("#content").undelegate("#become_member", "click");
                $("#content").undelegate("#chat-form", "submit");
                $("#content").undelegate("#delete_chat", "click");
                $("#content").undelegate("#delete_member", "click");
                new chatListView();
            }
        };
});