# global bookmark settings
VERSION = '0.0.1'
NAME = 'bookmark'
DEBUG = True

SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/%s.db' % (NAME)
