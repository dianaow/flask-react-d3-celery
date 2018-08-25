from os import environ
import os
#basedir = os.path.abspath(os.path.dirname(__file__))

# Configs
REDIS_HOST = "0.0.0.0"
REDIS_PORT = 6379
BROKER_URL = environ.get('REDIS_URL', "redis://{host}:{port}/0".format(
    host=REDIS_HOST, port=str(REDIS_PORT)))
CELERY_RESULT_BACKEND = BROKER_URL

driver = 'postgresql+psycopg2://'

SQLALCHEMY_DATABASE_URI = driver \
	                        + environ.get('RDS_USERNAME') \
	                        + ':' + environ.get('RDS_PASSWORD') \
	                        +'@' + environ.get('RDS_HOSTNAME') \
	                        +  ':' + environ.get('RDS_PORT') \
	                        + '/' + environ.get('RDS_DB_NAME')

SQLALCHEMY_TRACK_MODIFICATIONS = False
