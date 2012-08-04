from flask import Blueprint, request, jsonify, session
from functools import wraps
from bookmark import service

from bookmark import app
from bookmark.service import get_tagcloud, get_tag, get_list_bookmark

from tagscloud import process_tag_count
from .item.Bookmark import ItemBookmark
from .item.Tag import ItemTag
from .form import BookmarkForm

from sqlalchemy.exc import IntegrityError

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

    bookmarks = get_list_bookmark(filter=filters, page=page, per_page=app.config['PER_PAGE'])
    total = get_list_bookmark(filters, count=True)
    bookmark_list = []

    for b in bookmarks:
        bookmark = ItemBookmark(b.id, b.tags, b.link, b.title, b.description)
        bookmark_list.append(bookmark)

    bookmark_list = map(lambda x: x.json(), bookmark_list)
    ret = {
        "bookmarks": bookmark_list,
        "page": page,
        "per_page": app.config['PER_PAGE'],
        "total": total,
    }

    return jsonify(ret)


@b.route('/bookmarks/<int:id>', methods=['PUT', ])
def update_bookmark(id):
    form = BookmarkForm(request.json, id=id)
    if form.validate_on_submit():
        service.edit_bookmark(form.bookmark)
        ret = {}
    else:
        ret = {
            "errors": form.errors
        }
    #BookmarkForm().reset_csrf()
    ret["csrf"] = session.get(app.config['CSRF_SESSION_KEY'])
    return jsonify(ret)


@b.route('/bookmarks/', methods=['POST', ])
def add_bookmark():
    form = BookmarkForm(request.json)
    ret = None
    if form.validate_on_submit():
        try:
            service.add_bookmark(form.bookmark)
            ret = {}
        except IntegrityError, e:
            errors = []
            if e.message == '(IntegrityError) column link is not unique':
                errors.append("Link alredy exists")
            ret = {
                "errors": {
                    "link": errors,
                }
            }
    else:
        ret = {
            "errors": form.errors,
        }

    BookmarkForm().reset_csrf()
    ret["csrf"] = session.get(CSRF_SESSION_KEY)
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

    cloud = get_tagcloud(filters)
    tags_list = [ItemTag(t.id, t.name, count).json() for t, count in cloud]
    process_tag_count(tags_list, max_percent=30, min_percent=11)
    tags_list = {"tags": [x.json() for x in filters_tags] + tags_list}

    return jsonify(tags_list)

