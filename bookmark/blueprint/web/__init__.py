from flask import Blueprint
from flask import render_template
from flask import request, url_for

from bookmark.blueprint.api.form import BookmarkForm
from werkzeug.contrib.atom import AtomFeed
from bookmark.service import get_list_bookmark

b = Blueprint('web', __name__)


@b.route('/', methods=['GET', ])
def index():
    form = BookmarkForm(create=True)
    return render_template('index.html', form=form)

@b.route('feed/news.xml')
def new_bookmarks_feed():
    feed = AtomFeed('Recent bookmarks', feed_url=request.url,
        url=url_for('web.index'))
    bookmarks = get_list_bookmark(page=0, per_page=20)
    for bookmark in bookmarks:
        feed.add(bookmark.title, unicode(bookmark.description),
            content_type='html', url=bookmark.link,
            updated=bookmark.update_time,
            published=bookmark.update_time)
    return feed.get_response()
