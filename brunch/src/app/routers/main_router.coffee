class exports.MainRouter extends Backbone.Router
  routes :
    "about": "about"
    "index/page/:page": "bookmark"

  about: ->
    console.log "about route"

  bookmark: (page) ->
    #console.log "bookmark route" + page
    page = Number(page)
    app.collections.bookmarks.fetch data : page : page
    app.collections.tags.fetch()
