from setuptools import setup, find_packages

README = open('README.md').read().strip()
CLASSIFIERS = [
    'Development Status :: 3 - Alpha',
    'Intended Audience :: '
]

setup(
    name="Bookmark",
    version="0.0.1",
    packages=find_packages(),
    scripts=['manage.py'],
    install_requires=[
        'Flask>=0.8',
        'Flask-Login>=0.1',
        'Flask-SQLAlchemy>=0.15',
        'Flask-WTF>=0.5',
    ],
    package_data={
        '': ['*.txt', '*.rst'],
    },
    author="Daroth",
    author_email='daroth@braindead.fr',
    description='Web bookmark manager',
    license='Beerware',
    keywords='bookmark manager',
    url='https://github.com/Daroth/Bookmark-v2'
)
