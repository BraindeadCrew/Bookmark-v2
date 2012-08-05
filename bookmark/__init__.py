"""
Bookmark flask app
"""
from flask import Flask
from flask_login import LoginManager
from flask_debugtoolbar import DebugToolbarExtension
from bookmark.config import Configuration


app = Flask(__name__, static_folder=Configuration.BASE_PATH+'/'+Configuration.STATIC_FOLDER)
app.config.from_object('bookmark.config.Configuration')
app.config.from_envvar('SALMON_LOCAL_SETTINGS', silent=True)


login_manager = LoginManager()
login_manager.init_app(app)

if app.config['DEBUG']:
    toolbar = DebugToolbarExtension(app)

from bookmark.blueprint import api
from bookmark.blueprint import web
from bookmark.blueprint import login

base = app.config['BASE_PATH']
print base
app.register_blueprint(api, url_prefix='%s/api' % (base,))
app.register_blueprint(web, url_prefix='%s/' % (base,))
app.register_blueprint(login, url_prefix='%s/user' % (base,))
