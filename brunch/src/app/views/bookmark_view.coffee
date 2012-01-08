bookmarkTemplate = require('templates/bookmark')

class exports.BookmarkView extends Backbone.View
  tagName: 'div'
  events:
    "click .label": "editBookmark"
  render: ->
    $(@el).html bookmarkTemplate(bookmark: @model.toJSON())
    @
  editBookmark: ->
   console.log @
   $("#link").val @model.get "link"
   $("#title").val @model.get "title"
   $("#description").val @model.get "description"
   $("#tags").val @model.get "tags"
   $("#bookmark-form-modal").modal "toggle"
