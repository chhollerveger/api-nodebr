## API-NODEBR

API desenvolvida no curso de Imersão em desenvolvimento de APIs com Node.js By #NodeBR!

#### Dependencias

- **docker**;
- **npm**;
- **node**;

## ---- SWAGGER

  http://localhost:5000/documentation#/
  https://api-nodebr.herokuapp.com//documentation#/

## ---- POSTGRESS
docker run \
  --name postgres \
  -e POSTGRES_USER=carloshollerveger \
  -e POSTGRES_PASSWORD=senhasecreta \
  -e POSTGRES_DB=heroes \
  -p 5432:5432 \
  -d \
  postgres

docker ps

## ---- MONGODB
docker run \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
  -d \
  mongo:4

docker ps

docker run \
  --name mongoclient \
  -p 3000:3000 \
  --link mongodb:mongodb \
  -d \
  mongoclient/mongoclient

## ---- ADMINER
docker run \
  --name adminer \
  -p 8080:8080 \
  --link postgres:postgres \
  -d \
  adminer

docker ps

## ---- CREATE USER MONGODB
docker exec -it mongodb \
  mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
  --eval "db.getSiblingDB('herois').createUser({user: 'carloshollerveger', pwd: 'senhasecreta', roles: [{role: 'readWrite', db: 'herois'}]})"

## ---- CASE CONFLICT
  docker rm $(docker ps -aq)

  rodar comandos acima

## ---- RODAR CONTAINERS JÁ CRIADOS
 listar os containers:
  docker ps -a

  inciar os containers pelo id:
  docker start :id

## ---- JWT
  npm i jsonwebtoken
  npm i hapi-auth-jwt2

## ---- HEROKU
  npm i -g heroku
  heroku login
  heroku apps:list
  heroku apps:create api-nodebr
  heroku git:remote --app api-nodebr
  git remote -v
  heroku logs
  git add . && git commit -m "v1" && git push heroku master 

## ---- pm2
  npm i pm2 -g
  pm2 start --name heroi -i 10 src/api.js
  pm2 monnit
  pm2 kill
  PM2_PUBLIC_KEY: uyh4pe9ysbuhgta
  PM2_SECRET_KEY: 7dy32g4xobr7ibn

## ---- coverage nyc
  npm i --save-dev nyc
  http://localhost:4000/coverage/
  https://api-nodebr.herokuapp.com/coverage/