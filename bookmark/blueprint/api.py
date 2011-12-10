from flask import Blueprint

from bookmark.settings import VERSION

b = Blueprint('api', __name__)

@b.route('/', methods=['GET',])
def index():
    return VERSION
