tagTemplate = require('templates/tag')

class exports.TagView extends Backbone.View
  tagName: 'span'
  className: 'tag'
  events:
    "click": "switchFilter"
  switchFilter: ->
    @model.switchFilter()
    return
  render: ->
    $(@el).html tagTemplate tag: @model.toJSON()
    @
