from os import environ
import os

REDIS_HOST = environ.get('REDIS_HOST') if environ.get('REDIS_HOST') else "0.0.0.0"
REDIS_PORT = 6379
broker_url = "redis://{host}:{port}/0".format(host=REDIS_HOST, port=str(REDIS_PORT))
result_backend = broker_url

RDS_USERNAME = environ.get('RDS_USERNAME')
RDS_PASSWORD = environ.get('RDS_PASSWORD')
RDS_HOSTNAME = environ.get('RDS_HOSTNAME')
RDS_PORT = 5432
RDS_DB_NAME = environ.get('RDS_DB_NAME')

SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://{username}:{password}@{hostname}:{port}/{dbname}"\
						  .format(username = RDS_USERNAME, password = RDS_PASSWORD, \
						   hostname = RDS_HOSTNAME, port = str(RDS_PORT), dbname = RDS_DB_NAME)

SQLALCHEMY_TRACK_MODIFICATIONS = False

CRON_MIN = environ.get('CRON_MIN')
CRON_HOUR = environ.get('CRON_HOUR')
CRON_DAY = environ.get('CRON_DAY')

AWS_ACCESS_KEY_ID=environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY=environ.get('AWS_SECRET_ACCESS_KEY')
