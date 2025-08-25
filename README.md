News Aggregator Project
This is a Django-based news aggregator that scrapes articles from various news sources, stores them in a database, and displays them on a modern, responsive website.

Prerequisites
Python 3.8 or higher

pip (Python package installer)

A MySQL server

Setup and Installation
Clone/Download and Set Up Virtual Environment:

# (Assuming you have the code)
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

Install Dependencies:

pip install -r requirements.txt

Configure Database in settings.py:
Open news_aggregator/settings.py and update the DATABASES block with your MySQL user and password. You do not need to create the database manually.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'news_aggregator_db', # Or any name you want
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

Create the Database (New Step):
Run the custom command to automatically create the database in MySQL.

python manage.py create_db

Run Database Migrations:
Now that the database exists, this command will create the necessary tables.

python manage.py migrate

Create a Superuser:
Create an admin account to manage news sources.

python manage.py createsuperuser

How to Use the Aggregator
Start the Server:

python manage.py runserver

Add News Sources:

Navigate to http://127.0.0.1:8000/admin/

Log in and go to the "Sources" section to add news websites.

Scrape for News Articles:

python manage.py scrape_news

View the Website:

Visit http://127.0.0.1:8000/ to see the results.