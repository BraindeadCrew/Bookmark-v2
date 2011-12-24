TagView = require('views/tag_view').TagView

class exports.TagscloudView extends Backbone.View
  className: "tagscloud"
  initialize: ->
    @collection.bind 'reset', @addAll, @
    return
  addAll: ->
    $("#tagscloud").empty()
    @collection.each @addOne
    return
  addOne: (tag) ->
    view = new TagView model: tag
    $('#tagscloud').append(view.render().el)
    return
