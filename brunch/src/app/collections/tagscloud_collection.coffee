TagModel = require('models/tag_model').TagModel

class exports.TagscloudCollection extends Backbone.Collection
  model: TagModel
  initialize: ->
    @bind 'all', (e) ->
      console.log "TagscloudCollection", e, @
    @bind 'change:filter', @update, @
  url: ->
    ret = "/api/tagcloud"
    filters = @urlFilters()
    ret += '/' + filters if filters? and filters != ""
    return ret
  getFiltered: ->
    @filter (tag) ->
      tag.get('filter')
  getUnfiltered: ->
    @reject (tag) ->
      tag.get('filter')
  update: ->
    @fetch()
  urlFilters: ->
    f = @getFiltered()
    list = _.map f, (e) ->
        e.get('name')
    filters = list.join('+')
    return filters
  parse: (response) ->
    response.tags
