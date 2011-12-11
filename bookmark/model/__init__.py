from flaskext.sqlalchemy import SQLAlchemy

from bookmark import app, settings
import logging

db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI


logging.basicConfig(filename='db.log')
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

tags = db.Table('bookmark_tag',
    db.Column('bookmark_id', db.Integer, db.ForeignKey('bookmark.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)


class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tags = db.relationship('Tag', secondary=tags,
        backref=db.backref('bookmarks', lazy='dynamic'))
    link = db.Column(db.String(255), unique=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text())

    def __repr__(self):
        return '<Bookmark (%d, %s %s) %s>' % (self.id, self.title, self.link,
            self.tags)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)

    def __init__(self, pname):
        self.name = pname

    def __repr__(self):
        return '<Tag (%d, %s)>' % (self.id, self.name)
