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

# app bootstrapping on document ready
$(document).ready ->
  app.initialize = ->
    mainRouter = new MainRouter()
    bookmarkCollection = new BookmarkCollection()
    tagsCloudCollection = new TagscloudCollection()

    bookmarkCollectionView = new BookmarkCollectionView collection: bookmarkCollection
    tagscloudView = new TagscloudView collection: tagsCloudCollection

    bookmarkCollection.fetch()
    tagsCloudCollection.fetch()
    return
  app.initialize()
  Backbone.history.start()
  return
