from bookmark import app
from flaskext.script import Manager, Command
from bookmark.init import reset_all


manager = Manager(app)


class SyncDB(Command):
    def run(self):
        reset_all('sample.json')


manager.add_command('syncdb', SyncDB())
manager.run()
