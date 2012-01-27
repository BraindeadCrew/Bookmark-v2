import argparse
from lxml.html.soupparser import fromstring
from bookmark.blueprint.api.item.Bookmark import ItemBookmark
from bookmark.service import add_bookmark

parser = argparse.ArgumentParser(description='Delicious bookmark import')
parser.add_argument('path', type=str, help='path to delicious.html file')

args = parser.parse_args()
path = args.path

content = open(path).read()
xml = fromstring(content)

for link in xml.xpath("/html/dl/dt/a"):
    item = {
        "title": link.text,
        "link": link.get("href"),
        "description": "",
        "tags": [{"name": x.strip(),} for x in link.get("tags").split(',')]
    }
    i = ItemBookmark(**item)
    add_bookmark(i)


