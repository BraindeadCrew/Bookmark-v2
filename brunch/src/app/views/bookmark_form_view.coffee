BookmarkModel = require('models/bookmark_model').BookmarkModel

class exports.BookmarkFormView extends Backbone.View
  tagName: 'div'
  el: $('#bookmark-form-modal')
  template: _.template($("#bookmark-form-modal-template").html())
  events:
    "submit": "submitForm"
  initialize: ->
    @idSelector = "#id"
    @linkSelector = "#link"
    @titleSelector = "#title"
    @descriptionSelector = "#description"
    @tagsSelector = "#tags"
    @csrfSelector = "#csrf"

    app.collections.bookmarks.bind "show-bookmark-form", @showBookmarkForm, @
  render: (model) ->
    console.log "render form template"
    $(@el).html @template()
    if model
        $(@idSelector).val model.id
        $(@linkSelector).val model.get("link")
        $(@titleSelector).val model.get("title")
        $(@descriptionSelector).val model.get("description")
        $(@tagsSelector).val model.get("tags")
        $("#bookmark-form-modal .update").show()
    else
        $("#bookmark-form-modal .create").show()
        
    @
  submitForm: (e) ->
    e.preventDefault()
    id = parseInt $("#id").val()
    datas =
      link: $(@linkSelector).val()
      title: $(@titleSelector).val()
      description: $(@descriptionSelector).val()
      tags: $(@tagsSelector).val()
      csrf: $(@csrfSelector).val()

    if _.isNumber id
      bookmark = app.collections.bookmarks.get $("#id").val()
    else
      bookmark = new BookmarkModel


    if !_.isNumber id
      app.collections.bookmarks.add bookmark
    bookmark.save datas,
      error: (model, errors) ->
        console.log "error", model, errors
      success: (model, errors) ->
        console.log "success", model, errors
    return
  showBookmarkForm: (model) ->
    @render(model)
