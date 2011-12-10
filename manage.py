from bookmark import app
from bookmark.model import db

from flaskext.script import Manager, Command

import json


manager = Manager(app)



class SyncDB(Command):
    def run(self):
        db.drop_all()
        db.create_all()

        items = json.loads(open('sample.json').read())
        for item in items:
            # TODO add sample.json content in database
            pass


manager.add_command('syncdb', SyncDB())
manager.run()
