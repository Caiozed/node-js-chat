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
           "logout": "logout",
           "chats": "chat_list",
           "chat/:id": "chat"
        },
        
        index: function(){
            App.update_status();
            if(!App.is_logged_in()){
                indexView.initialize();
            }else{
                App.redirect_to("#chats");
            }
        },
        
        signup: function(){
            App.update_status();
            if(!App.is_logged_in()){
                signupView.initialize();
            }else{
                App.redirect_to("#chats");
            }
        },
        
        login: function(){
            App.update_status();
            if(!App.is_logged_in()){
                loginView.initialize();
            }
        },
        
        logout: function(){
            App.update_status();
            sessionStorage.clear();
            App.redirect_to("#");
        },
        
        chat_list: function(){
            App.update_status();
           if(App.is_logged_in()){
                chatListView.initialize();
            }else{
                App.redirect_to("#login");
            }
        },
        
        chat: function(chat_id){
            App.update_status();
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