# Pull base image.
FROM ubuntu

# Install Supervisor.
RUN \
  mkdir /var/log/celery && \
  mkdir /var/log/redis && \
  mkdir /home/ubuntu && \
  apt-get update && \
  apt-get install -y supervisor python-pip wget vim git && \
  rm -rf /var/lib/apt/lists/* && \
  sed -i 's/^\(\[supervisord\]\)$/\1\nnodaemon=true/' /etc/supervisor/supervisord.conf

# needs to be set else Celery gives an error (because docker runs commands inside container as root)
# https://github.com/pm990320/docker-flask-celery/blob/master/Dockerfile
ENV C_FORCE_ROOT=1

# expose port 80 of the container (HTTP port, change to 443 for HTTPS)
EXPOSE 80

# Create virtualenv.
RUN \
  pip2 install --upgrade pip && \
  pip install --upgrade virtualenv && \
  virtualenv -p /usr/bin/python2.7 /home/ubuntu/.virtualenvs/celery_env

WORKDIR /home/ubuntu/celery-scheduler

ADD requirements.txt /home/ubuntu/celery-scheduler/

# Install app requirements
ENV PATH=/home/ubuntu/.virtualenvs/bin:$PATH
RUN pip install -r requirements.txt

COPY . /home/ubuntu/celery-scheduler

# Copy supervisor configs
RUN \
  cp configs/supervisord.conf /etc/supervisor/supervisord.conf && \
  cp configs/conf.d/*.conf /etc/supervisor/conf.d/

ENV FLASK_APP /home/ubuntu/celery-scheduler/app/__init__.py
ENV FLASK_DEBUG 1

CMD ["flask", "run", "--host", "0.0.0.0"]