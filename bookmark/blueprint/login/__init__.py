from .form import LoginForm
from .form import RegisterForm
from flask import Blueprint
from flask import redirect
from flask import url_for
from flask import request
import bookmark
from flask_login import login_user
from flask_login import logout_user
from flask.templating import render_template
from bookmark.service import add_user
from bookmark.service import get_user_by_id

b = Blueprint('user', __name__)

login_manager = bookmark.login_manager


@login_manager.user_loader
def load_user(userid):
    return get_user_by_id(userid)


@b.route('/login', methods=['GET', 'POST', ])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # login and valide the user...
        login_user(form.user, remember=form.remember.data)
        return redirect(request.args.get('next') or url_for('web.index'))
    return render_template('login.html', form=form)


@b.route('/register', methods=['GET', 'POST', ])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        # register if ok
        add_user(form.user)
        return redirect(url_for('web.index'))
    return render_template('register.html', form=form)


@b.route('/logout', methods=['GET', ])
def logout():
    logout_user()
    return redirect(url_for('web.index'))
