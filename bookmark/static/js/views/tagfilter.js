BookmarkApp.Views.TagFilter = Backbone.View.extend({
        className: "tag-filter",
        events: {
            "click": "removeFilter"
        },
        removeFilter: function() {
            console.log("remove filer", this);
        },
        render: function() {
            $(this.el).html(this.model.name);
            return this
        }
    });

