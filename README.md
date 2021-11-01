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

If you are using docker, just hit `npm run postgres:start` on terminal.

Ok, you are all set.

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

### Create a dealer: POST /dealer

To create a dealer you need to send a json respecting the following format:

```
{
	"name": "example name",
	"cpf": "06850588087",
	"email": "email@test.com",
	"password": "password"
}
```

### Authentication: POST /auth/login

All endpoints below require an access token that can be generated consuming this endpoint. All you need to do is send a json with a valid dealer email and password.

```
{
	"email": "email@test.com",
	"password": "password"
}
```
This reproduces a JWT Token. It should be informed as a Bearer Token in Authentication Header.

### Get dealer cashback: GET /dealer/cashback
This one gets the available amount of cashback credit a dealer has based on Boticario Grupo Api

### Create a order: POST /order
To create a dealer you need to send a json respecting the following format:
```
{
	"code": "001",
	"dealerCpf": "06850588087",
	"date": "2021-10-31",
	"valueInCents": 50000
}
```

### List orders: GET /order
This one lists all created orders for a dealer. By default it will retrieve a pagination with 10 items per page, on the first page. Optionally you can inform
```
{
    currentPage: number,
    perPage: number,
    status: "validating" | "approved"
}
```
on query to specify pagination and filter orders by status.
## Collection

To easily test it, download a complete [Insomnia Collection](https://drive.google.com/file/d/1iXhNhGVxYmRrJcs8mJ1dAw5JQUamXuua/view?usp=sharing).

## Observations

- All monetary values when dealing with orders should be treated as cents.
```
For example:
R$ 1.00 = 100
R$ 509.40 = 50940
```
- All requests generates a log on console, so pay attention.