
🚀 SF-1 Deployment Anleitung:

1. PM2:
$ npm install pm2 -g
$ pm2 start ecosystem.config.js

2. Docker:
$ docker build -t sf1-api .
$ docker run -d -p 3001:3001 sf1-api

3. Swagger:
Installiere:
$ npm install swagger-ui-express
Nutze: /api-docs

4. Postman:
Importiere die .postman_collection.json Datei
