from bookmark.model import Bookmark, Tag, db, User
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from sqlalchemy import func


def convert_bookmark(bookmark):
    b = Bookmark()
    b.id = bookmark._id
    b.link = bookmark.link
    b.title = bookmark.title
    b.description = bookmark.description
    if bookmark.tags is not None:
        for tag in bookmark.tags:
            b.tags.append(get_tag_or_create(tag))
    return b


def get_tag_or_create(name):
    """
    return a tag, create it if it does not currently exist
    """
    tag = get_tag(name)
    if tag is None:
        tag = Tag(name)
        db.session.add(tag)
        db.session.commit()
    return tag


def get_tag(name):
    return Tag.query.filter_by(name=name).first()


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


def get_list_bookmark(filter=None, count=False, page=None, per_page=None):
    """
    solution pour le count, faire une sous requete qui sera ensuite
    utilise par le count de la requette principale
    """

    query = Bookmark.query if not count else db.session.query(Bookmark.id)
    if filter is not None and len(filter) > 0:
        bookmark_tag = db.metadata.tables['bookmark_tag']
        query = query.filter(Bookmark.id == bookmark_tag.c.bookmark_id)\
            .filter(bookmark_tag.c.tag_id.in_(filter))\
            .group_by(Bookmark.id)\
            .having(func.count(Bookmark.id) == len(filter))

    if page is not None and per_page is not None:
        query = query.limit(per_page).offset((page - 1) * per_page)

    if count:
        subquery = query.subquery()
        return db.session.query(func.count(Bookmark.id))\
            .filter(Bookmark.id == subquery.c.id).all()[0][0]
    else:
        return query.all()


def add_bookmark(bookmark):
    b = convert_bookmark(bookmark)
    db.session.add(b)
    db.session.commit()


def check_user(pseudo, password):
    """
    Check is couple pseudo/password match an user.
    @params pseudo user's pseudo
    @params passwd user's password
    @return null if it does not match, User object otherwise.
    """
    user = User.filter_by(pseudo=pseudo)
    #passwd =


def add_user(user):
    """
    Add an user.
    @param user user model object.
    """
    db.session.add(user)
    db.session.commit()


def count_user_by_pseudo(pseudo):
    """
    @param pseudo A pseudo
    Count number of user with the defined pseudo.
    """
    return db.session.query(func.count(User.id))\
        .filter(User.pseudo == pseudo).first()[0]


def check_password(pseudo, password):
    """
    @param pseudo A pseudo
    @param password A password
    @return None is unknow user or wrong password, user model object otherwire.
    Check if pseudo and password match an user.
    """
    ret = None

    supposed_user = User.query.filter_by(pseudo=pseudo).first()
    if supposed_user is not None:
        if check_password_hash(supposed_user.password, password):
            ret = supposed_user

    return ret


def get_user_by_id(userid):
    return User.query.get(userid)
