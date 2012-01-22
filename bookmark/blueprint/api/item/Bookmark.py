class ItemBookmark:
    def __init__(self, _id=None, tags=None, link='', title='', description=''):
        self._id = _id
        self.tags = []
        self.set_tags(tags)
        self.link = link
        self.title = title
        self.description = description

    def json(self):
        return {
            'id': self._id,
            'tags': self.tags,
            'link': self.link,
            'title': self.title,
            'description': self.description,
        }

    def set_tags(self, tags):
        """
        populate a tags list with tags param
        """
        if tags is not None:
            self.tags = []
            for t in tags:
                if type(t) is dict:
                    self.tags.append(t['name'])
                else:
                    self.tags.append(t.name)
