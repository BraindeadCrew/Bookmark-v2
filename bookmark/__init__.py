"""
Bookmark flask app
"""
from flask import Flask

from flaskext.login import LoginManager
#from flaskext.debugtoolbar import DebugToolbarExtension


from bookmark import settings

app = Flask(settings.NAME, static_folder=settings.STATIC_FOLDER)
app.config['DEBUG'] = settings.DEBUG
app.config['SECRET_KEY'] = settings.SECRET_KEY
app.config['CSRF_ENABLED'] = True
app.config['CSRF_SESSION_KEY '] = settings.CSRF_SESSION_KEY


login_manager = LoginManager()
login_manager.setup_app(app)

#if settings.DEBUG:
#    toolbar = DebugToolbarExtension(app)

from bookmark.blueprint import api
from bookmark.blueprint import web
from bookmark.blueprint import login

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(web, url_prefix='/')
app.register_blueprint(login, url_prefix='/user')
