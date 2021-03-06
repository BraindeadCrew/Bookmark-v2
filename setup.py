from setuptools import setup, find_packages

README = open('README.md').read().strip()
CLASSIFIERS = [
    'Development Status :: 3 - Alpha',
    'Intended Audience :: '
]

setup(
    name="Bookmark",
    version="0.0.2-SNAPSHOT",
    packages=find_packages(),
    scripts=['manage.py', 'import.py', ],
    install_requires=[
        'Flask>=0.9',
        'Flask-Login>=0.1.3',
        'Flask-SQLAlchemy>=0.15',
        'Flask-WTF>=0.8',
        'BeautifulSoup>=3.2.0',
        'Flask-Script>=0.3.3',
        'Flask-DebugToolbar>=0.1.3',
        'lxml>=2.3.5' ,
        'httplib2>=0.7.4',
    ],
    package_data={
        '': ['*.txt', '*.rst'],
    },
    author='Daroth',
    author_email='daroth@braindead.fr',
    description='Web bookmark manager',
    license='Beerware',
    keywords='bookmark manager',
    url='https://github.com/Daroth/Bookmark-v2'
)
