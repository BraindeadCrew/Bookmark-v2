from flaskext.sqlalchemy import SQLAlchemy

from bookmark import app, settings

db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI


tags = db.Table('bookmark_tag',
    db.Column('bookmark_id', db.Integer, db.ForeignKey('bookmark.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)

class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tags = db.relationship('Tag', secondary=tags, backref=db.backref('bookmarks', lazy='dynamic'))
    link = db.Column(db.String(255), unique=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text())


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
