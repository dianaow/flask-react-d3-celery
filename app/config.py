import os
from dotenv import load_dotenv

if os.getenv('FLASK_ENV')=='development':
	load_dotenv(dotenv_path='config/docker/development/dev-variables.env')
else:
	load_dotenv(dotenv_path='config/docker/production/.env')

REDIS_HOST = os.getenv('REDIS_HOST') if os.getenv('REDIS_HOST') else "0.0.0.0"
REDIS_PORT = 6379
broker_url = "redis://{host}:{port}/0".format(host=REDIS_HOST, port=str(REDIS_PORT))
result_backend = broker_url

POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_PORT = 5432

SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://{username}:{password}@{hostname}:{port}/{dbname}"\
						  .format(username = POSTGRES_USER, password = POSTGRES_PASSWORD, \
						   hostname = POSTGRES_HOST, port = str(POSTGRES_PORT), dbname = POSTGRES_DB)

SQLALCHEMY_TRACK_MODIFICATIONS = False

CRON_MIN = os.getenv('CRON_MIN')
CRON_HOUR = os.getenv('CRON_HOUR')
CRON_DAY = os.getenv('CRON_DAY')

API_SERVER_HOST = 'localhost'
API_SERVER_PORT = 5000
WEB_SERVER_HOST = 'localhost'
WEB_SERVER_PORT = 3000
