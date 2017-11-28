define([
    "jquery",
    "backbone",
    "underscore",
    "text!js/templates/edit-chat.html",
], function($, Backbone, _, editChatTemplate){
    var editChatView = Backbone.View.extend({
        el: $("#content"),
        template: _.template(editChatTemplate),
        events: {
            "submit #edit-chat-form": "editChat",
        },
       
       initialize: function(){
            this.render(); 
       },
       
       render: function(){
            this.$el.html(this.template);
            this.getChat();
       },
       
       getChat: function(){
            $.ajax({
                url: "/chat/"+this.id,
                method: "GET",
                dataType: "json",
                success: function(response){
                    $("#name").val(response[0].name);
                    $("#description").val(response[0].description);
                },
               
               error: function(response){
                   $("#error-handling").html(response);
               }
            });
       },

        editChat: function(e){
            e.preventDefault();
            var name = $("#name").val().trim();
            var description = $("#description").val().trim();
            $.ajax({
                url: "/edit/chat/"+this.id,
                method: "POST",
                dataType: "json",
                data: {name: name, description: description},
                success: function(response){
                    if(response.status==400){
                        $("#error-handling").html(response.msg);
                    }else{
                        App.redirect_to("#chats"); 
                    }
                },
               
               error: function(response){
                   $(".chat-list").prepend(response);
               }
           });
       }
    });
    
    return {
            initialize: function(id){
                $("#content").undelegate("#edit-chat-form", "submit");
                new editChatView({id: id});
            }
        };
});