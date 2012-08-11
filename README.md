#### Bookmark

Bookmarks manager

Based on flask and backbone

server side 100% json api
client side 100% backbone

### First start :

1) Configuration
2) Edit sample.json if you wan user or sample data and db initialisation (python manager.py syndb)
3) python manage.py runserver

### Configuration

SALMON_LOCAL_SETTINGS environment variable defines configuration file path.

You can override any configuration variable you wand in it.

Example (/home/local_config.py):
DEBUG=False
SQLALCHEMY_DATABASE_URI = 'sqlite:///bookmark.db'
PER_PAGE=150

And then starts server with :
SALMON_LOCAL_SETTINGS=/home/local_config.py python manager.py runserver

### Configuration variables

Every configuration variables can be found in ./bookmark/config.py, source are auto-documented.


### FIXME
   pagination is very bad when page number increase
   tag cloud is also totally unusable over a quantity of tag in db

### TODO
  User authentication -> adding more ways to log in and json api authenfication too
  adding a bookmark bookmark's button
  adding a way to easily configure differents configurations for dev and production environments
  moving tagscloud module as a dependency outside of the project
  adding a delicious import script
  admin/contributor/anonymous roles
  adding a dynamic tag searchbox


