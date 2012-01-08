from flaskext.wtf import Form
from flaskext.wtf import HiddenField
from flaskext.wtf import TextField
from flaskext.wtf import validators
from flaskext.wtf import TextAreaField
from flaskext.wtf import SubmitField
from flaskext.wtf.html5 import URLField

class BookmarkForm(Form):
    id = HiddenField(u'Id')
    link = URLField(u'Link', validators=[validators.required(), validators.url(), ])
    title = TextField(u'Title', validators=[validators.required(), ])
    description = TextAreaField(u'Description')
    tags = TextField(u'Tags')
    submit = SubmitField(u'Add')

    def __init__(self, create, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)
        self.create = create

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False

        # TODO : add id control if create is False (modification mode need a valid bookmark id)
        return True
