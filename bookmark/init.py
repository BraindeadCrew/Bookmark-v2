from bookmark.model import db, User
import json
from bookmark.blueprint.api.item.Bookmark import ItemBookmark
from bookmark.service import add_bookmark, add_user


def reset_all(json_file):
    db.drop_all()
    db.create_all()

    items = json.loads(open(json_file).read())
    for item in items['bookmarks']:
        i = ItemBookmark(**item)
        add_bookmark(i)
    for item in items['users']:
        i = User(**item)
        add_user(i)
