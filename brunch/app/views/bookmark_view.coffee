bookmarkTemplate = require('templates/bookmark')

class exports.BookmarkView extends Backbone.View
  tagName: 'div'
  events:
    "click .label": "editBookmark"
  render: ->
    $(@el).html bookmarkTemplate(bookmark: @model.toJSON())
    @
  editBookmark: ->
    app.collections.bookmarks.trigger "show-bookmark-form", @model
