class exports.TagView extends Backbone.View
  tagName: 'span'
  className: 'tag'
  template: _.template($('#tag-template').html())
  events:
    "click": "addFilter"
  addFilter: ->
    console.log "add filter", @
    return
  render: ->
    $(@el).html(@template(@model.toJSON()))
    @
