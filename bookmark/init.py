from bookmark.model import db
import json
from bookmark.blueprint.api.item.Bookmark import ItemBookmark
from bookmark.service import add_bookmark

def reset_all(json_file):
    db.drop_all()
    db.create_all()

    items = json.loads(open(json_file).read())
    for item in items:
        i = ItemBookmark(ptags=item['tags'],
            plink=item['link'], ptitle=item['title'],
            pdescription=item['description'], json=True)
        add_bookmark(i)
