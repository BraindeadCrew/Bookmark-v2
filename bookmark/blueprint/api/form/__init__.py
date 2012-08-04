from flask_wtf import Form
from flask_wtf import HiddenField
from flask_wtf import TextField
from flask_wtf import validators
from flask_wtf import TextAreaField
from flask_wtf import SubmitField
from flask_wtf.html5 import URLField
from bookmark.blueprint.api.item.Bookmark import ItemBookmark
from werkzeug.datastructures import MultiDict
from bookmark.service import get_bookmark_by_id

from flask import abort


class AjaxForm(Form):
    def __init__(self, formdata=None, *args, **kwargs):
        if formdata is not None:
            formdata = MultiDict(formdata.items())
        super(AjaxForm, self).__init__(formdata, *args, **kwargs)


class BookmarkForm(AjaxForm):
    id = HiddenField(u'Id')
    link = URLField(u'Link', validators=[validators.required(),
        validators.url(), ])
    title = TextField(u'Title', validators=[validators.required(), ])
    description = TextAreaField(u'Description')
    tags = TextField(u'Tags')
    submit = SubmitField(u'Add')
    edit = SubmitField(u'Edit')

    def __init__(self, formdata=None, *args, **kwargs):
        self.id.data = kwargs.get('id', None)
        super(BookmarkForm, self).__init__(formdata, *args, **kwargs)

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False

        _id = self.id.data
        link = self.link.data
        title = self.title.data
        description = self.description.data
        tags = map(lambda x: {'name': x.strip()}, self.tags.data.split(','))

        if _id is None or _id == '' or int(_id) < 1:
            self.bookmark = ItemBookmark(tags=tags, link=link, title=title,
                description=description)
        else:
            self.bookmark = get_bookmark_by_id(_id)
            if self.bookmark is None:
                abort(404)
            self.bookmark.title = title
            self.bookmark.description = description
            self.bookmark.set_tags(tags)

        return True
