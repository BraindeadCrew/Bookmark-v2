class ItemBookmark:
    def __init__(self, pid=None, ptags=None, plink='', ptitle='',
        pdescription=''):
        self._id = pid
        self.tags = ptags if (ptags is not None) else []
        self.link = plink
        self.title = ptitle
        self.description = pdescription

    def json(self):
        return {
            '_id': self._id,
            'tags': self.tags,
            'link': self.link,
            'title': self.title,
            'description': self.description,
        }
