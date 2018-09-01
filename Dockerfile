FROM ubuntu

RUN apt-get update && apt-get -y upgrade

RUN apt-get install -y python-pip && pip install --upgrade pip

RUN mkdir /home/ubuntu

WORKDIR /home/ubuntu/celery-scheduler

ADD requirements.txt /home/ubuntu/celery-scheduler/

RUN pip install -r requirements.txt

COPY . /home/ubuntu/celery-scheduler

EXPOSE 5000

CMD ["python", "flask_app.py", "--host", "0.0.0.0"]