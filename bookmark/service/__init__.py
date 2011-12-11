from bookmark.model import Bookmark, Tag, db
from sqlalchemy import func


def convert_bookmark(bookmark):
    # TODO does not take care of tags currently
    b = Bookmark()
    b.id = bookmark._id
    b.link = bookmark.link
    b.title = bookmark.title
    b.description = bookmark.description
    if bookmark.tags is not None:
        for tag in bookmark.tags:
            b.tags.append(get_tag(tag))
    return b


def get_tag(name):
    """
    return a tag, create it if it does not currently exist
    """
    tag = Tag.query.filter_by(name=name).first()
    if tag is None:
        tag = Tag(name)
        db.session.add(tag)
        db.session.commit()
    return tag


def get_tagcloud(filter=None):
    bookmark_tag = db.metadata.tables['bookmark_tag']
    query = db.session.query(Tag, func.count(Tag.id))\
        .filter(Tag.id == bookmark_tag.c.tag_id)
    if filter is not None and len(filter) > 0:
        subquery = db.session.query(Bookmark.id)\
            .filter(Bookmark.id == bookmark_tag.c.bookmark_id)\
            .filter(bookmark_tag.c.tag_id.in_(filter))\
            .group_by(Bookmark.id)\
            .having(func.count(Bookmark.id) == len(filter)).subquery()

        query = query.filter(bookmark_tag.c.bookmark_id == subquery.c.id)\
            .filter(~Tag.id.in_(filter))
    return query.group_by(Tag.id).all()


def get_list_bookmark(filter=None):
    query = Bookmark.query
    if filter is not None and len(filter) > 0:
        bookmark_tag = db.metadata.tables['bookmark_tag']
        query = query.filter(Bookmark.id == bookmark_tag.c.bookmark_id)\
            .filter(bookmark_tag.c.tag_id.in_(filter))\
            .group_by(Bookmark.id)\
            .having(func.count(Bookmark.id) == len(filter))
    return query.all()


def add_bookmark(bookmark):
    b = convert_bookmark(bookmark)
    db.session.add(b)
    db.session.commit()
