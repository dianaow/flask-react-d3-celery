# Data Visualization for Formula 1 Races

A full-stack dockerized web application to visualize Formula 1 race statistics from 2016 to present, with a Python Flask server and a React front-end with d3.js as data visualization tool. 

## Hosted at: www.notforcasualfans.com

## Data Source
- Thanks to the Ergast Developer API (https://ergast.com/mrd/), which provides data for the Formula 1 series and is updated after the conclusion of each race.

## How to automate the refresh/update of data visualization dashboard?
- This requires automating the data collection process. To do this, I created a task scheduler within the app powered by Celery to fetch data from Ergast's APIs periodically. Next, I created Python scripts to perform data transformation. The processed data is then saved to a Postgresql database which is hosted on AWS. 
- Celery schedules data to be extracted from Ergast API every Monday morning. If the day before is not a race weekend (Race weekends are spread out from  March to November with races occurring on Sundays), nothing gets saved to database and the scheduler retries the following week.
- The processed data is then retreived from database for implementing APIs.

## How to connect Flask and React?
- I used Flask to create REST APIs and have React consume the APIs by making HTTP requests to it.
- I did not use the create-react-app library , hence I had to create a custom Webpack configuration. Webpack and Babel (transpiler to convert ES6 code into a backwards compatible version of JavaScript) bundles up the React files in a folder separate from the Flask app. 

## Data Visualization in React using D3(V4)
- I used these two libraries together to create dynamic data visualization components. Data is retrieved from the APIs created by Flask.
- React and D3 are both able to control the Document Object Mode (DOM). To separate responsibilities as much as possible, I went by the following approach:

  + React owns the DOM
  + D3 calculates properties

This way, we can leverage React for SVG structure and rendering optimizations and D3 for all its mathematical and visualization functions.

## Architecture

![architecture_diagram](https://github.com/dianaow/celery-scheduler/blob/master/misc/flask_react_celery_architecture.png) 

# Getting Started

## Setup
This setup is built for deployment with Docker. 

**1. Clone the repository**

```bash
cd ~
git clone https://github.com/dianaow/.git
cd celery-scheduler
```

**2. Install Docker**

- [Mac or Windows](https://docs.docker.com/engine/installation/)
- [Ubuntu server](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)

**3. Build docker images with docker-compose and run it.**

  Configuration folder architecture:
  ```
  config  
  │
  └───docker
  │   │
  │   └───development
  │   │   │   dev-variables.env
  │   │   │   docker-compose.yml
  │   │ 
  │   └───production
  │       │   .env
  │       │   docker-compose-prod.yml
  │      
  │   
  │ Dockerfile
  │ Dockerfile-node
  ```
  To test the app locally, first enter the correct folder. 
  ```
  cd config/docker/development
  ```
  Then execute the following command:
  ```
  docker-compose -f docker-compose.yml up -d --build
  ```
  
  I have configured Docker such that when the postgres image is built and an instance (container) of it runs, a new database is created along with a postgres user and password. However, the database is currently empty and requires a psql script to load it with some data. The database shuts down when the container stops and is removed.
  
  Note:
  - -f: specify docker-compose file name (Not necessary to specify, unless named differently from standard 'docker-compose.yml'
  - up: Builds, (re)creates, starts, and attaches to containers for a service.
  - -d: Detached mode: Starts containers in the background and leaves them running 
  - --build: Build images before creating containers.
  
  
**3a) Check logs for successful build and run of docker containers**
  ```
  docker-compose logs
  ```
 Please refer to this repo's wiki for screenshots of what you should see from the console.
 
**3b) Loading database with data**

 I am unable to succesfully use an entrypoint script to initialize database with data, hence the workaround will be to manually load data from command line instead.
 
 **i.** Check the list of running containers 
 ```
 docker ps -a
 ```

 ![docker_compose_ps_a](https://github.com/dianaow/celery-scheduler/blob/master/misc/docker_compose_ps_a.png) 

 **ii.** To run bash command in docker container, enter ```docker exec -i -t <CONTAINER_ID> /bin/bash```
 
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; In this case, run ```docker exec -i -t 56bbaf49935b /bin/bash``` (Note: my CONTAINER ID will be different from yours, so don't copy-paste)
 
 **iii.** Run below command to dump 'init.psql' to the database
 
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ```psql --host=localhost --port=5432 --username=test_user --password --dbname=f1_flask_db < ../init.psql```
 
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You will then be prompted for the password for test_user, which is **'test_pw'**
 
 **iv.** Log into the database. Try querying it!
 
 ![docker_command_psql](https://github.com/dianaow/celery-scheduler/blob/master/misc/docker_command_psql.png) 
 
 
  **You may now point your browser to http://localhost:3000 to view the frontend**
  **You may now point your browser to http://localhost:5000/api/results or view the APIs**


 **3c) Initialize task scheduler with celery**
 
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **i.** Based on the last step, we should still be in 'development_postgresql' container. Exit from postgresql by entering '\q'. Exit from container by entering 'exit'. Next, identify the "development_app" container id and enter it (similar to steps 3b.1 and 3b.2).

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **ii.** Trigger the below command: ```celery -A app.tasks worker -B -l info```
  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; That's it! For testing purpose, i have set celerybeat to trigger task to data collect every 15 minutes.

 **4) To stop running of docker containers and remove them**
  ```
  docker-compose down
  ```
  
  
**For enquiries, you may contact me at diana.ow@gmail.com**
