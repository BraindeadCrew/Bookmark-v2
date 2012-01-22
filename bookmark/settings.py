# global bookmark properties
VERSION = '0.0.1'
NAME = 'bookmark'
DEBUG = True
SECRET_KEY = "you must definitly change this!"
CSRF_SESSION_KEY = "_csrf_token"
MIN_PASSWORD_LENGTH = 1  # at least 6 in prod env
STATIC_FOLDER = 'web'
SALT_LENGTH = 142

SEPARATOR = '+'

# database properties
SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/%s.db' % (NAME)

# pagination properties
PER_PAGE = 2
