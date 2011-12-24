class exports.BookmarkView extends Backbone.View
  tagName: 'div'
  template: _.template($('#bookmark-template').html())
  render: ->
    $(@el).html(@template(@model.toJSON()))
    @
