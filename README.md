# Data Visualization for Formula 1 Races

A full-stack dockerized web application to visualize Formula 1 race statistics from 2016 to present, with a Python Flask server and a React front-end with d3.js as data visualization tool. 

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

![architecture_diagram](https://github.com/dianaow/celery-scheduler/blob/master/flask_react_celery_architecture.png) 

# Getting Started

## Setup
This setup is built for deployment with Docker. 

**1. Clone the repository**

```bash
cd ~
git clone https://github.com/dianaow/celery-scheduler.git
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
  │   │   │   .env
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
  
  You can then point your browser to http://localhost:5000
  
  Note:
  - -f: specify docker-compose file name (Not necessary to specify, unless named differently from standard 'docker-compose.yml'
  - up: Builds, (re)creates, starts, and attaches to containers for a service.
  - -d: Detached mode: Starts containers in the background and leaves them running 
  - --build: Build images before creating containers.
  
  
3a) Check for successful deployment:
  ```
  docker-compose logs
  ```

3b) To stop running of docker containers:
  ```
  docker-compose down
  ```


**For enquiries, you may contact me at diana.ow@gmail.com**


