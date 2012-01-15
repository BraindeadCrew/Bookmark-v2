from flaskext.wtf import Form
from flaskext.wtf import HiddenField
from flaskext.wtf import TextField
from flaskext.wtf import validators
from flaskext.wtf import TextAreaField
from flaskext.wtf import SubmitField
from flaskext.wtf.html5 import URLField
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
    _id = HiddenField(u'Id')
    link = URLField(u'Link', validators=[validators.required(),
        validators.url(), ])
    title = TextField(u'Title', validators=[validators.required(), ])
    description = TextAreaField(u'Description')
    tags = TextField(u'Tags')
    submit = SubmitField(u'Add')
    edit = SubmitField(u'Edit')

    def __init__(self, formdata=None, *args, **kwargs):
        print "***********************"
        print kwargs
        self._id.data = kwargs.get('id', None)
        super(BookmarkForm, self).__init__(formdata, *args, **kwargs)

    def validate(self):
        rv = Form.validate(self)
        if not rv:
            return False

        _id = self._id.data
        link = self.link.data
        title = self.title.data
        description = self.description.data
        tags = map(lambda x: {'name': x.strip()}, self.tags.data.split(','))

        print "##################################"
        print "___%s___" % (_id)
        print _id is ''
        print _id is None
        print _id < 1
        print _id is None or _id < 1
        print type(_id)

        if _id is None or _id is '' or _id < 1:
            self.bookmark = ItemBookmark(tags=tags, link=link, title=title, description=description)
        else:
            self.bookmark = get_bookmark_by_id(_id)
            if self.bookmark is None:
                abort(404)
            #self.bookmark.link = link
            self.bookmark.title = title
            self.bookmark.description = description
            self.bookmark.set_tags(tags)

        return True
