from flaskext.wtf import Form
from flaskext.wtf import validators
from flaskext.wtf import TextField, PasswordField, SubmitField
from flaskext.wtf import BooleanField
from flaskext.wtf import ValidationError
from bookmark import settings
from bookmark.model import User
from bookmark.service import count_user_by_pseudo
from bookmark.service import check_password


def unique_user(form, field):
    """
    Check if user's pseudo is not already used.
    """
    if count_user_by_pseudo(field.data) > 0:
        raise ValidationError("Pseudo unavailable.")


def user_exists(form, field):
    if count_user_by_pseudo(field.data) == 0:
        raise ValidationError("Does not exists.")


class LoginForm(Form):
    def __init__(self, *args, ** kwargs):
        Form.__init__(self, *args, ** kwargs)
        self.user = None

    login = TextField(u'Login', validators=[validators.required(), ])
    password = PasswordField(u'Password', validators=[validators.required(), ])
    remember = BooleanField(u'Remember me')
    submit = SubmitField(u'Validate')

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False

        pseudo = self.login.data
        password = self.password.data

        try:
            user_exists(self, self.login)
            user = check_password(pseudo, password)
            if user is None:
                self.password.errors.append('Wrong password.')
                return False
        except ValidationError:
            self.login.errors.append('Unknow user.')
            return False

        self.user = user

        return True


class RegisterForm(Form):
    login = TextField(u'Login', validators=[validators.required(),
        unique_user, ])
    password = PasswordField(u'Password', validators=[validators.required(),
        validators.length(min=settings.MIN_PASSWORD_LENGTH), ])
    password_confirmation = PasswordField(u'Password confirmation',
        validators=[validators.required(),
        validators.length(min=settings.MIN_PASSWORD_LENGTH), ])
    submit = SubmitField(u'Register')

    def __init__(self, *args, ** kwargs):
        Form.__init__(self, *args, ** kwargs)
        self.user = None

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False

        pseudo = self.login.data
        password = self.password.data
        password_confirmation = self.password_confirmation.data

        if password != password_confirmation:
            self.password.errors.append('Passwords mismatch')
            self.password_confirmation.errors.append('Passwords mismatch')
            return False

        self.user = User(pseudo, password)

        return True
