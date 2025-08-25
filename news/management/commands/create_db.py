# news/management/commands/create_db.py
import time
from django.core.management.base import BaseCommand
from django.conf import settings
import MySQLdb

class Command(BaseCommand):
    help = 'Creates the database specified in settings.py if it does not exist.'

    def handle(self, *args, **options):
        db_settings = settings.DATABASES['default']
        
        # Ensure we're using MySQL
        if 'mysql' not in db_settings['ENGINE']:
            self.stdout.write(self.style.WARNING("This command is only for MySQL databases."))
            return

        db_name = db_settings['NAME']
        user = db_settings['USER']
        password = db_settings['PASSWORD']
        host = db_settings['HOST']
        port = int(db_settings.get('PORT', 3306))

        try:
            # Connect to the MySQL server (without specifying a database)
            self.stdout.write("Connecting to MySQL server...")
            conn = MySQLdb.connect(host=host, user=user, password=password, port=port)
            cursor = conn.cursor()

            # Use "IF NOT EXISTS" to prevent errors if the DB already exists
            self.stdout.write(f"Creating database '{db_name}'...")
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            
            cursor.close()
            conn.close()
            
            self.stdout.write(self.style.SUCCESS(f"Database '{db_name}' created successfully or already exists."))

        except MySQLdb.Error as e:
            self.stderr.write(self.style.ERROR(f"Database creation failed: {e}"))
            self.stderr.write(self.style.WARNING("Please ensure your MySQL server is running and the credentials in settings.py are correct."))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An unexpected error occurred: {e}"))
