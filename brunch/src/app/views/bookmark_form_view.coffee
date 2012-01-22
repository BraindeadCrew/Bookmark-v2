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
    @csrfTokenSelector = "#bookmark-csrf"

    app.collections.bookmarks.bind "show-bookmark-form", @showBookmarkForm, @
  render: (model) ->
    $(@el).html @template()
    $(@csrfSelector).val $(@csrfTokenSelector).val()
    if model
        $(@idSelector).val model.id
        $(@linkSelector).attr("disabled", "disabled")
        $(@linkSelector).val model.get("link")
        $(@titleSelector).val model.get("title")
        $(@descriptionSelector).val model.get("description")
        $(@tagsSelector).val model.get("tags")
        $("#bookmark-form-modal .update").show()
    else
        $("#bookmark-form-modal .create").show()
        $(@idSelector).val ""
        
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
      success: (model, response) ->
        $("#bookmark-csrf").val response.csrf
        $("#csrf").val response.csrf
        if response.errors?
            errors = response.errors
            if errors.link
                $("#link").parent().parent().addClass("error")
                $("#link").next().empty()
                $("#link").next().append err for err in errors.link
            if errors.title
                $("#title").parent().parent().addClass("error")
                $("#title").next().empty()
                $("#title").next().append err for err in errors.title
            if errors.description
                $("#description").parent().parent().addClass("error")
                $("#description").next().empty()
                $("#description").next().append err for err in errors.description
            if errors.tags
                $("#tags").parent().parent().addClass("error")
                $("#tags").next().empty()
                $("#tags").next().append err for err in errors.tags
            if errors.csrf
                $("#global-errors").empty()
                $("#global-errors").append err for err in errors.csrf
        else
            $("#bookmark-form-modal").modal('hide')
    return
  showBookmarkForm: (model) ->
    @render(model)
