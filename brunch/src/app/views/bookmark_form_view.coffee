class exports.BookmarkFormView extends Backbone.View
    tagName: 'div'
    el: $('#bookmark-form-modal')
    template: _.template($("#bookmark-form-modal-template").html())
    events:
        "click #submit": "submitForm"
    render: ->
       $(@el).html(@template())
       @
    submitForm: (e) ->
       e.preventDefault()
        
       @
