class ItemBookmark:
    def __init__(self, pid=None, ptags=None, plink='', ptitle='',
        pdescription='', json=False):
        self._id = pid
        self.tags = []
        if ptags is not None:
            for t in ptags:
                if json:
                    self.tags.append(t['name'])
                else:
                    self.tags.append(t.name)
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
