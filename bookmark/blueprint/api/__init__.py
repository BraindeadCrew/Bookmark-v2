from flask import Blueprint, request

from bookmark import app
from bookmark.settings import VERSION
from bookmark.service import get_tagcloud


from .item.Bookmark import ItemBookmark

import json

b = Blueprint('api', __name__)


@b.route('/', methods=['GET', ])
def index():
    return VERSION


@b.route('/tagcloud', methods=['GET', ])
@b.route('/tagcloud/<string:tags>', methods=['GET', ])
def tagcloud(tags=None):
    filters = []
    if tags is not None:
        filters = tags.split('+')
    # here selection tags matching filters
    get_tagcloud([1])
    tags_list = map(lambda x: x.json(),
        [ItemBookmark(pid=1), ItemBookmark(pid=2)])
    response = app.make_response(json.dumps(tags_list))
    response.mimetype = 'application/json'
    return response
