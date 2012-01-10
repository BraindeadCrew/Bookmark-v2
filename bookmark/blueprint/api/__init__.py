from flask import Blueprint, request, jsonify
from functools import wraps
from bookmark import service

from bookmark import app
from bookmark.settings import VERSION, PER_PAGE, SEPARATOR
from bookmark.service import get_tagcloud, get_tag, get_list_bookmark

from tagscloud import process_tag_count
from .item.Bookmark import ItemBookmark
from .item.Tag import ItemTag
from .form import BookmarkForm

b = Blueprint('api', __name__)


@b.route('/', methods=['GET', ])
def index():
    return VERSION


@b.route('/bookmarks/', methods=['GET', ])
@b.route('/bookmarks/<string:tags>', methods=['GET', ])
def bookmarks(tags=None):
    filters = []
    if tags is not None:
        filters = [x.id for x in
            [get_tag(x) for x in tags.split(SEPARATOR)]
            if x is not None]

    page = int(request.args.get('page', "1"))

    bookmarks = get_list_bookmark(filter=filters, page=page, per_page=PER_PAGE)
    total = get_list_bookmark(filters, count=True)
    bookmark_list = []

    for b in bookmarks:
        bookmark = ItemBookmark(b.id, b.tags, b.link, b.title, b.description)
        bookmark_list.append(bookmark)

    bookmark_list = map(lambda x: x.json(), bookmark_list)
    ret = {
        "bookmarks": bookmark_list,
        "page": page,
        "per_page": PER_PAGE,
        "total": total,
    }

    return jsonify(ret)


@b.route('/bookmarks/', methods=['POST', ])
def add_bookmark():
    form = BookmarkForm(request.json, create=True)
    ret = None
    if form.validate_on_submit():
        # register form
        service.add_bookmark(form.bookmark)
        ret = ["OK"]
    else:
        ret = form.errors
    return jsonify(ret)


@b.route('/tagcloud', methods=['GET', ])
@b.route('/tagcloud/<string:tags>', methods=['GET', ])
def tagcloud(tags=None):
    filters = []
    filters_tags = []
    if tags is not None:
        query_list = [get_tag(x) for x in tags.split(SEPARATOR)]
        filters_tags = map(lambda x: ItemTag(pid=x.id, pname=x.name,
            pfilter=True), query_list)
        filters = map(lambda x: x.id, query_list)

    tagcloud = get_tagcloud(filters)
    filter_list = []
    for (t, count) in tagcloud:
        tag = ItemTag(t.id, t.name, count)
        filter_list.append(tag)

    tags_list = map(lambda x: x.json(), filter_list)
    process_tag_count(tags_list, max_percent=30, min_percent=11)
    tags_list = {"tags": [x.json() for x in filters_tags] + tags_list}

    return jsonify(tags_list)
