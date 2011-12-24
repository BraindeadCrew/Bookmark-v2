BookmarkApp.Routers.Workspace = Backbone.Router.extend({
    routes: {
        "about" :           "about",
        "index/page/:page": "bookmark"
    },
    about: function() {
        console.log("about route");
    },
    bookmark: function(page) {
        this.trigger("pagechange", page);
    }   
});
