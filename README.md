# Star Wars API 


### Pasos

Instalar dependencias

```sh
npm ci
```

### Configurar .env (.env.example)


### Iniciar proyecto localmente

```sh
npm start
```


### Ejecutar tests

El servidor debe estar funcionando

```sh
npm run test
```

### Apis

- Servicios en DynamoDB

| servicio      | detalle                       |
|:--------------|:----------------------------------|



- Servicios integrados de MSSQL

| servicio      | detalle                       |
|:--------------|:----------------------------------|


### Despliegue

Tener en cuenta instalar `serverless` de manera global o usar `npx`.
También deber tener un usuario con los permisos correspondientes. [IAM](https://docs.aws.amazon.com/es_es/IAM/latest/UserGuide/introduction.html)

```sh
sls deploy
```

### Para más detalles

- [API Doc Swagger](https://g5sc9m1igk.execute-api.sa-east-1.amazonaws.com/swagger)