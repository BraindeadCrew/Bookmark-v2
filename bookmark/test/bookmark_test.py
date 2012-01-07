import unittest

from bookmark import app

#from bookmark.model import db

#from bookmark.service import add_bookmark

class BookmarkTest(unittest.TestCase):
    def setUp(self):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
        db.create_all()

    def test_add_bookmark():
        assert False



    def tearUp():
        db.drop_all()


if __name__ == '__main__':
    unittest.main()
