from flask import Flask

from bookmark import settings

app = Flask(settings.NAME)
app.config['DEBUG'] = settings.DEBUG


from bookmark.blueprint import api

app.register_blueprint(api, url_prefix='/api')
