BookmarkModel = require('models/bookmark_model').BookmarkModel
MainRouter = require('routers/main_router').MainRouter

class exports.BookmarkCollection extends Backbone.Collection
  model: BookmarkModel
  initialize: ->
    @bind 'all', (e) ->
        console.log "BookmarkCollection", e, @
    app.collections.tags.bind 'change', @update, @
    return
  url: ->
    ret = "/api/bookmarks/"
    filters = app.collections.tags.urlFilters()
    ret += filters if filters?
    return ret
  router: MainRouter
  parse: (response) ->
    @per_page = response.per_page
    @total = response.total
    @page = response.page
    response.bookmarks
  update: ->
    console.log 'bookmark collection update'
    @fetch()
