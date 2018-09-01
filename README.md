# celery-scheduler

## for running server
cd celery-scheduler
python flask_app.py


## for celery task
cd celery-scheduler
celery -A app.tasks worker -B -l info