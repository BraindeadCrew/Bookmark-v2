class ItemTag:
    def __init__(self, pid=None, pname=None, pcount=0, pfilter=False):
        self._id = pid
        self.name = pname
        self.count = pcount
        self.size = 0
        self.filter = pfilter

    def json(self):
        return {
            '_id': self._id,
            'name': self.name,
            'count': self.count,
            'filter': self.filter,
        }
