from flaskext.sqlalchemy import SQLAlchemy

from bookmark import app, settings
import logging

db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI


logging.basicConfig(filename='db.log')
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

tags = db.Table('bookmark_tag',
    db.Column('bookmark_id', db.Integer, db.ForeignKey('bookmark.id'),
        nullable=False),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), nullable=False)
)


class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tags = db.relationship('Tag', secondary=tags,
        backref=db.backref('bookmarks', lazy='dynamic'))
    link = db.Column(db.String(255), unique=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text(), nullable=False)

    def __repr__(self):
        return '<Bookmark (%d, %s %s) %s>' % (self.id, self.title, self.link,
            self.tags)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __init__(self, pname):
        self.name = pname

    def __repr__(self):
        return '<Tag (%d, %s)>' % (self.id, self.name)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pseudo = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
