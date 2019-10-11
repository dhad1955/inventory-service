# Inventory Service

Inventory service responsible for adding/removing items from a players inventory
## Installation

Use the package manager [npm](https://www.npmjs.com/) to install

```bash
npm install
```

## Dependencies
Inventory service requires a local testing environment with redis and mysql installed. 
It's reccommended that you use the included docker-compose file to run these locally

(Port 3306 and 6379 will need to be available)

``` docker-compose build && docker-compose up ```

Alternatively, without using compose, you can install redis and mysql locally, once these are installed you will need to import the schema and base data which can be found in ```config/db/pixel.sql```

## Usage
Start the server by running the entrypoint script

``` npm start ```

P

# Endpoints
**Retrieve all items from a players inventory**
```
GET /players/{playerId}/inventory
```
#
**Add a new item to players inventory**
```
POST /players/{playerId}/inventory
```
_With the body_
```
{
"itemId": 1,
"amount": 20
}
```
#
**Delete an item from the players inventory**
```
DELETE /players/{playerId}/inventory/{id}
```
_With the body_
```
{"amount": 10}
````
Note that you must use the unique id from the players inventory (not the actual item id) 

# Notes
This is a fully tested working version, however the codebase is far from perfect, listed below is a number of changes that could be improved on

* Code repetition when loading the player, this could potentially be improved by using express middleware
* Singleton pattern on Database/Redlock, would be better if we had some kind of service registry that defined these
* Better validation using JSONSchema
* Run the server within docker removing the need to expose ports locally
* Multiple environments (qa/staging/prod)
* Decorator classes for responses 