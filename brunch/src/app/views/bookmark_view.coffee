bookmarkTemplate = require('templates/bookmark')

class exports.BookmarkView extends Backbone.View
  tagName: 'div'
  render: ->
    $(@el).html bookmarkTemplate(bookmark: @model.toJSON())
    @
