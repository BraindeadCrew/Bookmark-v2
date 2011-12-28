window.app = {}
app.routers = {}
app.models = {}
app.collections = {}
app.views = {}

MainRouter = require('routers/main_router').MainRouter
BookmarkCollection = require('collections/bookmark_collection').BookmarkCollection
TagscloudCollection = require('collections/tagscloud_collection').TagscloudCollection
BookmarkCollectionView = require('views/bookmark_collection_view').BookmarkCollectionView
TagscloudView = require('views/tagcloud_view').TagscloudView

$(document).ready ->
  app.initialize = ->
    app.routers.main = new MainRouter()
    app.collections.tags = new TagscloudCollection()
    app.collections.bookmarks = new BookmarkCollection()

    app.views.bookmarkCollection = new BookmarkCollectionView()
    app.views.tagscloud = new TagscloudView()

    app.routers.main.navigate 'index/page/1', true if Backbone.history.getFragment() is ''
  app.initialize()
  Backbone.history.start()
