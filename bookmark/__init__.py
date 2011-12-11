from flask import Flask

from bookmark import settings

app = Flask(settings.NAME)
app.config['DEBUG'] = settings.DEBUG


from bookmark.blueprint import api, web

app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(web, url_prefix='/')
