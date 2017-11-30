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
        
        is_member: 0,
        is_admin: 0,
        chat_info: "",
        message_count: 0,
        events: {
            "click #send": "sendMessage",
            "keypress #message": "checkInput"
        },
        
        template: _.template(chatTemplate),
       
        initialize: function(){
            var that = this;
            App.is_member(this.id, function(response){
               that.is_member = response; 
            });
            App.get_chat(this.id, function(response){that.chat_info = response;});
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
            if(msg == ""){
                return;
            }
            
            if(this.is_member == 0){
                $(".online-users").append("<p class='alert alert-danger'>You must be a member before sending messages!</p>");
            }else{
                App.make_ajax_request(
                    "/new/message", 
                    "POST", 
                    "json", 
                    {msg: msg, user_id: sessionStorage.user_id, chat_id: this.id, date: date},
                    
                    function(response){
                        
                    },
                    
                    function(response){
                       $("#error-handling").html(response);
                    }
                );
                $("#message").text('');
                that.getMessages(); 
            }
            },
       
        getMessages: function(){
            var that = this;
           App.make_ajax_request(
                "/messages", 
                "POST", 
                "json", 
                {chat_id: this.id}, 
                function(response){
                    var temp = _.template(messagesPartialTemplate);
                    $(".message-list").html(temp({messages: response, _: _, chat_info: that.chat_info}));  
                    $('.message-list').scrollTop(1E10);
                },
                
                function(response){
                   $("#error-handling").html(response);
                }
            );
        },
       
        getMembers: function(){
            var that = this;
            App.make_ajax_request(
                "/members", 
                "POST", 
                "json", 
                {chat_id: this.id}, 
                function(response){
                    console.log(that.is_admin);
                    var temp = _.template(membersPartialTemplate);
                    $(".online-users").append(temp({members: response, _: _, chat_info: that.chat_info}));  
                },
                
                function(response){
                   $("#error-handling").html(response);
                }
            );
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
                $("#content").undelegate("#send", "click");
                $("#content").undelegate("#message", "keypress");
                new chatView({id: id});
            }
        };
});