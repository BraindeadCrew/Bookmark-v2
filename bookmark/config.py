class Configuration(object):
  DEBUG = True
  SRF_ENABLED = True
  CSRF_SESSION_KEY = "csrf_token"
  VERSION = '0.0.1'
  NAME = 'bookmark'
  SECRET_KEY = "you must definitly change this!"
  MIN_PASSWORD_LENGTH = 1  # at least 6 in prod env
  STATIC_FOLDER = 'web'
  SALT_LENGTH = 142
  SEPARATOR = '+'

  # database properties
  SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/%s.db' % (NAME)

  # pagination properties
  PER_PAGE = 2
  BASE_PATH=''
