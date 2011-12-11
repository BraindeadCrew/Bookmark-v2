from flask import Blueprint
from flask import render_template

b = Blueprint('web', __name__)


@b.route('/', methods=['GET', ])
def index():
    return render_template('index.html')
