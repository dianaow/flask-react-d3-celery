A full-stack dockerized web application to visualize Formula 1 race statistics, with a Python Flask server and a React front-end with d3.js as data visualization tool. 

## Data Source
- Thanks to the Ergast Developer API (https://ergast.com/mrd/), which provides data for the Formula 1 series and is updated after the conclusion of each race.
- I created a Python script to extract data from Ergast's APIs periodically and perform data transformation. The processed data is then saved to a Postgresql database which is hosted on AWS.

## How to connect Flask and React?
- I used Flask to create a REST API and have React consume the API by making HTTP requests to it.
- I did not use the create-react-app library , hence I had to create a custom Webpack configuration. Webpack and Babel (transpiler to convert ES6 code into a backwards compatible version of JavaScript) bundles up the React files in a folder separate from the Flask app. 

## How to automate the refresh/update of data visualization dashboard?
- This requires automating the data collection process. To do this, I created a task scheduler within the app powered by Celery to fetch data periodically from Flask API and feed it to the data visualizations. Celery schedules data to be extracted from Ergast API every Monday morning. If the day before is not a race weekend (Race weekends are spread out from  March to November with races occurring on Sundays), nothing gets saved to database and the scheduler retries the following week.

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
	- To install docker in Ubuntu, you may run the install script:
		```
		sudo bash scripts/startup/ubuntu_docker_setup.sh
		```
    
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

 
