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
            if(App.is_member(this.id) == 0){
                $(".online-users").append('<p class="alert alert-danger">You need to be a member before being able to send messages</p>');
            }else{
                App.make_ajax_request(
                    "/new/message", 
                    "POST", 
                    "json", 
                    {msg: msg, user_id: sessionStorage.user_id, chat_id: this.id, date: date},
                    function(){
                        $("#message").text('');
                    },
                    
                    function(response){
                       $("#error-handling").html(response);
                    }
                );
                that.getMessages();
            }
       },
       
       getMessages: function(){
           App.make_ajax_request(
                "/messages", 
                "POST", 
                "json", 
                {chat_id: this.id}, 
                function(response){
                    var temp = _.template(messagesPartialTemplate);
                    $(".message-list").html(temp({messages: response, _: _})); 
                },
                
                function(response){
                   $("#error-handling").html(response);
                }
            );
       },
       
       getMembers: function(){
           App.is_member(this.id, function(response){
                var temp = _.template(membersPartialTemplate);
                $(".online-users").append(temp({members: response, _: _}));  
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
                $("#content").undelegate("#send", "click");
                $("#content").undelegate("#message", "keypress");
                new chatView({id: id});
            }
        };
});