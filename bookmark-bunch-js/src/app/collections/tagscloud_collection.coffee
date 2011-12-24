TagModel = require('models/tag_model').TagModel

class exports.TagscloudCollection extends Backbone.Collection
  model: TagModel
  url: "/api/tagcloud"
