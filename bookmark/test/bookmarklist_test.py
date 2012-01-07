import unittest
import os
import tempfile
import bookmark
from bookmark.init import reset_all


class BookmarkListTest(unittest.TestCase):
    def setUp(self):
        self.db_fd, filename = tempfile.mkstemp()
        bookmark.app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///%s" % (filename)
        bookmark.app.config['TESTING'] = True
        self.app = bookmark.app.test_client()
        reset_all('sample.json')

    def test_without_filter(self):
        """
        Test if all tags are returned with relevant count values.
        """
        assert False


    def withOneTag(self):
        """
        Test if all tag are returned when it asked to be filtered by one tag.
        """
        assert False

    def withTwoTags(self):
        """
        Same as withOneTag test but with two tags.
        """

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(bookmark.app.config['DATABASE'])

if __name__ == '__main__':
    unittest.main()
