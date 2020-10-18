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

## ---- SWAGGER

  http://localhost:5000/documentation#/

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