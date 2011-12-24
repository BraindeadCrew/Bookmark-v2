BookmarkApp.Views.Tagscloud = Backbone.View.extend({
        className: "tagscloud",
        initialize: function() {
            this.collection.bind('reset', this.addAll, this);
        },
        addAll: function() {
            $("#tagscloud").empty();
            this.collection.each(this.addOne);    
        },
        addOne: function(tag) {
            var view = new TagView({model: tag});
            $('#tagscloud').append(view.render().el);
        }
    });

