"""
Bookmark flask app
"""
from flask import Flask
from flask_login import LoginManager
from flaskext.debugtoolbar import DebugToolbarExtension


app = Flask(__name__, static_folder=Configuration.STATIC_FOLDER)
app.config.from_object('bookmark.config.Configuration')
#app.config.from_envvar('SALMON_LOCAL_SETTINGS', silent=True)
app.config.from_envvar('SALMON_LOCAL_SETTINGS')


login_manager = LoginManager()
login_manager.init_app(app)

#if settings.DEBUG:
#    toolbar = DebugToolbarExtension(app)

from bookmark.blueprint import api
from bookmark.blueprint import web
from bookmark.blueprint import login

app.register_blueprint(api, url_prefix=app.config['BASE_PATH'] + '/api')
app.register_blueprint(web, url_prefix=app.config['BASE_PATH'] + '/')
app.register_blueprint(login, url_prefix=app.config['BASE_PATH'] + '/user')
