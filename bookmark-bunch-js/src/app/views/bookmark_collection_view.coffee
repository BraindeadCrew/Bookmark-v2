BookmarkView = require('views/bookmark_view').BookmarkView

class exports.BookmarkCollectionView extends Backbone.View
  className: 'bookmarks'
  el: $('#pagination-bookmarks')
  template: _.template($('#pagination-template').html())
  initialize: ->
    @collection.bind 'reset', @addAll, @
    @collection.bind 'all', @render, @
    return
  addAll: ->
    $('#bookmarks').empty()
    @collection.each @addOne
    @render
    return
  addOne: (e) ->
    view = new BookmarkView { model: e }
    $('#bookmarks').append(view.render().el)
    return
  render: ->
    ttl_page = Math.ceil(@collection.total / @collection.per_page)
    $(@el).html(@template { ttl_page: ttl_page,page: @collection.page })
    return @
