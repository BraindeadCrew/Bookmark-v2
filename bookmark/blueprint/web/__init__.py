from flask import Blueprint
from flask import render_template

from bookmark.blueprint.api.form import BookmarkForm

b = Blueprint('web', __name__)


@b.route('/', methods=['GET', ])
def index():
    form = BookmarkForm(True)
    return render_template('index.html', form= form)
