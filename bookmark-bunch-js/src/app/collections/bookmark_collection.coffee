BookmarkModel = require('models/bookmark_model').BookmarkModel
MainRouter = require('routers/main_router').MainRouter

class exports.BookmarkCollection extends Backbone.Collection
  model: BookmarkModel
  url: ->
    return "/api/bookmarks/page/" + @page
  router: MainRouter
  page: 1
  initialize: ->
    @router.bind("pagechange", @loadPage, @)
  parse: (response) ->
    @per_page = response.per_page
    @total = response.total
    response.bookmarks
  loadPage: (page) ->
    @page = page
    @fetch()
    return
