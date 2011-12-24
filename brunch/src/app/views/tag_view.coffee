tagTemplate = require('templates/tag')

class exports.TagView extends Backbone.View
  tagName: 'span'
  className: 'tag'
  events:
    "click": "addFilter"
  addFilter: ->
    console.log "add filter", @
    return
  render: ->
    $(@el).html tagTemplate(tag: @model.toJSON())
    @
