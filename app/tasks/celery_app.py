import os
from datetime import datetime
from celery.app.base import Celery
from celery.schedules import crontab
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker

celery = Celery('tasks')

default_config = dict(
    task_ignore_result=True,
    task_store_errors_even_if_ignored=True,
    timezone='Asia/Singapore',
)

try:
    from app import config

    config_local_dict = {k: v for k, v in config.__dict__.items()}
    default_config.update(config_local_dict)
except Exception as e:
    print("No config for local machine")

celery.conf.update(default_config)

celery.conf.beat_schedule = {
    'run_get_scheduled_results': {
        'task': 'get_scheduled_results',
        'schedule': crontab(minute="*"),
        #'schedule': crontab(minute=0, hour=1, day_of_week="MON"),
        'args': ()
    }
}

engine = create_engine(celery.conf["SQLALCHEMY_DATABASE_URI"], convert_unicode=True, pool_recycle=3600)
conn = engine.connect()
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
