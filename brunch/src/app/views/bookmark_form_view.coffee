BookmarkModel = require('models/bookmark_model').BookmarkModel

class exports.BookmarkFormView extends Backbone.View
  tagName: 'div'
  el: $('#bookmark-form-modal')
  template: _.template($("#bookmark-form-modal-template").html())
  events:
    "submit": "submitForm"
  initialize: ->
    app.collections.bookmarks.bind "show-bookmark-form", @showBookmarkForm
  render: ->
    $(@el).html(@template())
    @
  submitForm: (e) ->
    e.preventDefault()
    id = $("#id").val()
    if _.isNumber id
      bookmark = app.collections.bookmarks.get $("#id").val()
    else
      bookmark = new BookmarkModel
    datas =
      link: $("#link").val()
      title: $("#title").val()
      description: $("#description").val()
      tags: $("#tags").val()
      csrf: $("#csrf").val()

    if !_.isNumber id
      app.collections.bookmarks.add bookmark
    bookmark.save datas,
      error: (model, errors) ->
        console.log "error", model, errors
      success: (model, errors) ->
        console.log "success", model, errors
    return
  showBookmarkForm: (bookmarkId) ->
    console.log "catchec", bookmarkId
