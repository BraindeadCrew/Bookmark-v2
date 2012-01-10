bookmarkTemplate = require('templates/bookmark')

class exports.BookmarkView extends Backbone.View
  tagName: 'div'
  events:
    "click .label": "editBookmark"
  render: ->
    $(@el).html bookmarkTemplate(bookmark: @model.toJSON())
    @
  editBookmark: ->
   @trigger "show-bookmark-form", $('#id').val()
