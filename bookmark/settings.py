# global bookmark properties
VERSION = '0.0.1'
NAME = 'bookmark'
DEBUG = True
STATIC_FOLDER = 'web'

SEPARATOR = '+'

# database properties
SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/%s.db' % (NAME)

# pagination properties
PER_PAGE = 2
