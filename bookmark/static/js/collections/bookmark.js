BookmarkApp.Collections.Bookmark = Backbone.Collection.extend({
    model: Bookmark,
    url: function() {
        return "/api/bookmarks/page/" + this.page;
    },
    router: workspace,
    page: 1,
    initialize: function() {
        this.router.bind("pagechange", this.loadPage, this);
    },
    parse: function(response) {
        this.per_page = response.per_page;
        this.total = response.total;
        return response.bookmarks;
    },
    loadPage: function(page) {
        this.page = page;
        this.fetch();
    }
});
