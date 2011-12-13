class ItemTag:
    def __init__(self, pid=None, pname=None, pcount=0):
        self._id = pid
        self.name = pname
        self.count = pcount
        self.size = 0

    def json(self):
        return {
            '_id': self._id,
            'name': self.name,
            'count': self.count,
        }
