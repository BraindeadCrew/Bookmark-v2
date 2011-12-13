from bookmark import app
from bookmark.model import db
from bookmark.blueprint.api.item.Bookmark import ItemBookmark
from bookmark.service import add_bookmark
from flaskext.script import Manager, Command


import json

manager = Manager(app)



class SyncDB(Command):
    def run(self):
        db.drop_all()
        db.create_all()

        items = json.loads(open('sample.json').read())
        for item in items:
            i = ItemBookmark(ptags=item['tags'],
                plink=item['link'], ptitle=item['title'],
                pdescription=item['description'], json=True)
            print("Add", i)
            add_bookmark(i)



manager.add_command('syncdb', SyncDB())
manager.run()
