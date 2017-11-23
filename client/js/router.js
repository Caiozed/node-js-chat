define([
    "jquery",
    "backbone",
    "underscore",
    "js/views/index.js",
    "js/views/signup.js",
    "js/views/login.js",
    "js/views/chat.js",
    "js/views/chat-list.js"
], function($, Backbone, _, indexView, signupView, loginView, chatView, chatListView){
    var Router = Backbone.Router.extend({
       routes:{
           "": "index",
           "signup": "signup",
           "login": "login",
           "chats": "chat_list",
           "chat/:id": "chat"
       },
       
       index: function(){
            if(!App.is_logged_in()){
                indexView.initialize();
            }
       },
       
       signup: function(){
            if(!App.is_logged_in()){
                signupView.initialize();
            }
       },
       
       login: function(){
            if(!App.is_logged_in()){
                loginView.initialize();
            }
       },
       
       chat_list: function(){
           if(App.is_logged_in()){
                chatListView.initialize();
            }else{
                App.redirect_to("#login");
            }
       },
       
       chat: function(chat_id){
           if(App.is_logged_in()){
                chatView.initialize(chat_id);
            }else{
                App.redirect_to("#login");
            }
       }
    });
    
    return {
            initialize: function(){
                new Router();
                Backbone.history.start();
            }
        };
});