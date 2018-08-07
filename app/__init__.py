from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from celery import Celery
import celeryconfig
from tasks.test import extract_to_df_race

def create_app():
    app = Flask(__name__)
    app.config.from_object('config')
    from models import Race, db
    db.init_app(app)
    with app.app_context():
        db.create_all()
    return app

f1 = create_app()

def make_celery(app):
    # create context tasks in celery
    celery = Celery(
        app.import_name,
        broker=app.config['BROKER_URL']
    )
    celery.config_from_object(celeryconfig)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask

    return celery

celery = make_celery(f1)
