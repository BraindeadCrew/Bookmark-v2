BookmarkApp.Views.BookmarkCollection = Backbone.View.extend({
    className: "bookmarks",
    el: $('#pagination-bookmarks'),
    template: _.template($('#pagination-template').html()),
    initialize: function() {
        this.collection.bind('reset', this.addAll, this);
        this.collection.bind('all', this.render, this);
    },
    addAll: function() {
        $('#bookmarks').empty();
        this.collection.each(this.addOne);
        this.render();
    },
    addOne: function(e) {
        var view = new BookmarkView({model: e});
        $('#bookmarks').append(view.render().el);
    },
    render: function() {
        ttl_page = Math.ceil(this.collection.total / this.collection.per_page);
        $(this.el).html(this.template({
            ttl_page: ttl_page, 
            page: this.collection.page
        }));
        return this;
    }
); 
