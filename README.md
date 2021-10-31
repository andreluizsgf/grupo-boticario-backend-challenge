# Grupo Boticário Backend Challenge

This API was developed to Grupo Boticário backend challenge.

## Getting Started

### Prerequisites

To run this application you need NPM, NodeJs and PostgreSQL or Docker installed on your computer.

### Installing

Lets get you prepared to use this API.

Install all dependencies:
```
npm ci
```

Create .env by coping .env.example:
```
cp .env.example .env
```

If you are using a local PostgreSQL, create a database for this api and specify the name and your postgres user on .env, on the following variables:

```
PG_DB_NAME
PG_DB_PASSWORD
PG_DB_HOST
PG_DB_USER
```

If you are using docker, just hit `docker-compose up -d` on terminal.

Ok, we are all set.

To run unit and integration tests, run `npm test` on console.

To start the application, just run `npm run dev` and enjoy it! :)

### Usage

## Endpoints
```
- POST /auth/login
- POST /dealer
- GET /dealer/cashback
- POST /order
- GET /order
```

## Collection

To easily test it, download a complete [Insomnia Collection](https://drive.google.com/file/d/1iXhNhGVxYmRrJcs8mJ1dAw5JQUamXuua/view?usp=sharing).

## Observations

All monetary values when dealing with orders should be treated as cents. For example:

R$ 1.00 = 100
R$ 509.40 = 50940