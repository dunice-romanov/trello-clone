# Shmrello: a simple Trello clone

# Description

Simple trello clone with these basic features:
- Register/Login
- View/Create Boards
- View/Create Lists
- Post/Update Cards in List
- Readonly sharing (not completley implemented yet, allows only to share)

# Setup and run

- Install requirenments.txt
- Setup postgres for next settings:

DATABASES = {
    'default': {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'trellodb',
    'USER': 'trello_admin',
    'PASSWORD': '123qweasd',
    'HOST': 'localhost',
    'PORT': '',
 }

- Make migrations from /trello_server: **python3 manage.py migrate**
- Run server from /trello_server: **python3 manage.py runserver**
- In /trello-angular run **npm install** and **npm start**
- Now your app located at **localhost:4200**!
