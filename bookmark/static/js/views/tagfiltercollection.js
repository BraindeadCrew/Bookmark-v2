BookmarkApp.Views.TagFilterCollection = Backbone.View.extend({
        className: "tags-filer-collection",
        initialize: function() {
           this.collection.bind('all', this.addAll, this);
        },
        addAll: function() {
            $('#tags-filter').empty();
            this.collection.each(this.addOne);
        },
        addOne: function(tag) {
            var view = new TagFilterView({model: tag});
            $("#tags-filter").append(view.render().el);
        }
    });


