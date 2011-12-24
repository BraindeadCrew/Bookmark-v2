BookmarkApp.Views.Bookmark = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#bookmark-template').html()),
    initialize: function() {
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
