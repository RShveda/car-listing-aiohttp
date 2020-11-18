# Car listing app 
Implemented with aiohttp/mongodb/react/docker stack.

# Deployment via docker-compose:
- download repository
- install/run docker
- navigate to project root folder and run "docker-compose up" command via terminal/cmd
- access the app from yur browser at "http://localhost:3001/"

*cars table should get pre-populated with 3 records during deployment

# Deployment locally:
- download repository
- install mongodb/node and all dependencies from /server/requirements.txt and from /client/package.json
- run mongo db
- navigate to /server folder and run "python main.py" to start server/api
- you may prepopulate db with fake data by running "python generate_data.py"
- navigate to /client and run "npm start" to start front-end application
- access the app from yur browser at "http://localhost:3000/"
