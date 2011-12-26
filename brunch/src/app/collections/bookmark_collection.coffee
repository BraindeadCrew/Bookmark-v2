BookmarkModel = require('models/bookmark_model').BookmarkModel
MainRouter = require('routers/main_router').MainRouter

class exports.BookmarkCollection extends Backbone.Collection
  model: BookmarkModel
  url: ->
    ret = "/api/bookmarks/page/" + app.routers.main.page
    filters = app.collections.tags.urlFilters()
    ret += '/' + filters if filters? and filters != ""
    return ret
  router: MainRouter
  parse: (response) ->
    @per_page = response.per_page
    @total = response.total
    response.bookmarks
