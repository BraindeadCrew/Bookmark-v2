BookmarkApp.Views.Tag = Backbone.View.extend({
    tagName: "span",
    className: "tag",
    template: _.template($('#tag-template').html()),
    events: {
        "click": "addFilter"
    },
    addFilter: function() {
        console.log("add filter", this);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
