from .api import b as api
from .web import b as web
from .login import b as login
from bookmark import app
from flask.templating import render_template


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
