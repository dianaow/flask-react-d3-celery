from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from celery import Celery
import celeryconfig
from tasks.test import extract_to_df_race

f1 = Flask(__name__)
f1.config.from_object('config')

db = SQLAlchemy(f1)

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

@f1.route('/')
def index():
    return "Hello, Flask is up and running!"

@f1.route('/data/races/all', methods=['GET'])
def race():
    #races_from_db = db_session.query(Race.raceName).all
    races_from_db = Race.query().all()
    return render_template('races.html', races_from_db=races_from_db)
