class exports.MainRouter extends Backbone.Router
  routes :
    "about": "about"
    "index/page/:page": "bookmark"

  about: ->
    console.log "about route"

  bookmark: (page) ->
    console.log "bookmark route" + page
    
