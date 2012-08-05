class exports.TagModel extends Backbone.Model
  urlRoot = '/bookmark/'
  defaults:
    filter: false
  initialize: ->
    @filter = @defaults.filter if not @filter?
    @bind 'all', (e) ->
        console.log "TagModel", e, @
  switchFilter: ->
    @set "filter": !@get("filter")
