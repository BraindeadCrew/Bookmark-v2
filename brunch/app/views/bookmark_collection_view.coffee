BookmarkView = require('views/bookmark_view').BookmarkView
paginationTemplate = require('templates/pagination')

class exports.BookmarkCollectionView extends Backbone.View
  className: 'bookmarks'
  el: $('#pagination-bookmarks')
  initialize: ->
    app.collections.bookmarks.bind 'reset', @addAll, @
    app.collections.bookmarks.bind 'all', @render, @
    return
  addAll: ->
    $('#bookmarks').empty()
    app.collections.bookmarks.each @addOne
    @render
    return
  addOne: (e) ->
    view = new BookmarkView { model: e }
    $('#bookmarks').append(view.render().el)
    return
  render: ->
    ttl_page = Math.ceil(app.collections.bookmarks.total / app.collections.bookmarks.per_page)
    page = app.collections.bookmarks.page
    has_prev = page > 1
    has_next = page < ttl_page
    $(@el).html(paginationTemplate(ttl_page: ttl_page, page: page, has_prev:  has_prev, has_next: has_next))
    @
