TagView = require('views/tag_view').TagView

class exports.TagscloudView extends Backbone.View
  className: "tagscloud"
  initialize: ->
    app.collections.tags.bind 'all', @addAll, @
    return
  addAll: ->
    functionFilter = (tag) ->
        tag.get('filter')
    $("#tagscloud").empty()
    $("#tags-filter").empty()
    @addOneUnfiltered tag for tag in app.collections.tags.getUnfiltered()
    @addOneFiltered tag for tag in app.collections.tags.getFiltered()
    return
  addOneUnfiltered: (tag) ->
    view = new TagView model: tag
    $('#tagscloud').append view.render().el
    return
  addOneFiltered: (tag) ->
    view = new TagView model: tag
    $('#tags-filter').append view.render().el
    return
