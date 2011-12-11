var Bookmark = Backbone.Model.extend({
});

var BookmarkCollection = Backbone.Collection.extend({
    model: Bookmark,
    url: "/api/bookmarks"
});
$(document).ready(function() {

    var BookmarkView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#bookmark-template').html()),
        initialize: function(){
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var BookmarkCollectionView = Backbone.View.extend({
        className: "bookmarks",
        el: $('#bookmarks'),
        initialize: function() {
            this.collection.bind('reset', this.addAll, this);
        },
        addAll: function() {
            this.collection.each(this.addOne);
        },
        addOne: function(e) {
            var view = new BookmarkView({model: e});
            $('#bookmarks').append(view.render().el);
        }
    }); 

    var bookmarkCollection = new BookmarkCollection();
    var bookmarkCollectionView = new BookmarkCollectionView({
        collection: bookmarkCollection
    });
    bookmarkCollection.fetch();
});
