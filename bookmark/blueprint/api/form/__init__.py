from flaskext.wtf import Form
from flaskext.wtf import HiddenField
from flaskext.wtf import TextField
from flaskext.wtf import validators
from flaskext.wtf import TextAreaField
from flaskext.wtf import SubmitField
from flaskext.wtf.html5 import URLField
from bookmark.blueprint.api.item.Bookmark import ItemBookmark
from werkzeug.datastructures import MultiDict


class BookmarkForm(Form):
    id = HiddenField(u'Id')
    link = URLField(u'Link', validators=[validators.required(),
        validators.url(), ])
    title = TextField(u'Title', validators=[validators.required(), ])
    description = TextAreaField(u'Description')
    tags = TextField(u'Tags')
    submit = SubmitField(u'Add')

    def __init__(self, create, json=None, *args, **kwargs):
        if json is not None:
            dico = MultiDict(json.items())
            kwargs['formdata'] = dico
        Form.__init__(self, *args, **kwargs)
        self.create = create

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False

        link = self.link.data
        title = self.title.data
        description = self.description.data
        tags = map(lambda x: {'name': x.strip()}, self.tags.data.split(','))

        # TODO : add id control if create is False (modification mode need a
        # valid bookmark id)
        self.bookmark = ItemBookmark(ptags=tags, plink=link, ptitle=title,
            pdescription=description, json=True)
        return True
