// router
var Workspace = Backbone.Router.extend({
    routes: {
        "about" :           "about",
        "index/page/:page": "bookmark"
    },
    about: function() {
        console.log("about route");
    },
    bookmark: function(page) {
        //console.log("page " + page);
        this.trigger("pagechange", page);
    }   
});

var workspace = new Workspace();

// models
var Bookmark = Backbone.Model.extend({
});

var Tag = Backbone.Model.extend({
});

// collections
var BookmarkCollection = Backbone.Collection.extend({
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

var TagscloudCollection = Backbone.Collection.extend({
    model: Tag,
    url: "/api/tagcloud"
});


$(document).ready(function() {
    var BookmarkView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#bookmark-template').html()),
        initialize: function(){
            //console.log('create bookmarkview', this.model);
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var BookmarkCollectionView = Backbone.View.extend({
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
    }); 

    var TagView = Backbone.View.extend({
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

    var TagFilterView = Backbone.View.extend({
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

    var TagFilterCollectionView = Backbone.View.extend({
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


    var TagscloudView = Backbone.View.extend({
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


    var bookmarkCollection = new BookmarkCollection();
    var tagscloudCollection = new TagscloudCollection();


    var bookmarkCollectionView = new BookmarkCollectionView({
        collection: bookmarkCollection
    });

    var tagscloudView = new TagscloudView({
        collection: tagscloudCollection
    });

    Backbone.history.start();


    bookmarkCollection.fetch();
    tagscloudCollection.fetch();
});
