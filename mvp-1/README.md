
# MVP-1

The capability that needs to be demonstrated 

- Added SQL(MySQL) and NoSQL(MongoDB) system into the development-environment architecture using Docker.

- Implemented JWT authentication using username/password from database rather than hard coding, which is prototyped by MVP-0

- Implemented more concrete microservices. This verion demonstrate a simplified Inventory and SystemLog microservices. Both run in a different runtime process and database backend.

- Improved code for automatic proxy configuration 

```

                port 3000    
  Client --> API Gateway--> Inventory  port 3001   <Shared MySQL>
               |      \
               |       \--> SystemLog  port 3002   <Shared MongoDB>
               |
        Security service 
        managed by gateway
               |
               v
          JWT <Shared MySQL>

```

## Working directory

```
PROJECT_ROOT_FOLDER/mvp-1
    ├── README.md       (your are reading this file)
    ├── gateway         (api gateway server)
    ├── gateway-tools   (gateway tools )
        ├── deleteAllAndBuilkCreateSampleInventories.js
        ├── deleteAllAndBuilkCreateSampleUsers.js
        ├── viewInventories.js
        ├── viewSyslogs.js
        └── viewUsers.js
    ├── mcservices      (Two microserivces)
        ├── inventory.js
        └── syslog.js
    ├── shared          (shared libs used by the server programs)
```


### MVP-0 (the past work)

- Simplified microservices demonstrated by the following nodejs programs

```
                port 3000    
  Client --> API Gateway--> mcv1  port 3001
                       \--> mcv2  port 3002
```

- Simplified JWT authentication offered by Gateway


# Testing

## We need MongoDB & MySQL run locally, the project provides them using Docker

Run the following command in a separated terminal at project root directory, at the same directory with docker-compose.yml. 
__Docker and Docker compose are required.__
```
$ docker-compose up
```

Expected output messages
```
Stopping demo_mongodb_1 ... done
Stopping demo_mysql_1   ... done

.. will be flooded with MySQL / MongoDB messages during the runtime
```

Database configuration defined by Docker

```
MongoDB
==============
mongodb://root:rootpassword@localhost:57017/demo
authSource: 'admin'
authMechanism: 'SCRAM-SHA-256'

MySQL
==============
localhost:53306
user: root
password: rootpassword
database: demo
```



## Run the two demo microservices

#### Install nodejs libs
```
$ yarn install
or
$ npm install
```

#### Create sample database

Run the two programs in ```gateway-tools``` folders 
```
$ cd mvp-1
$ cd gateway-tools
$ node deleteAllAndBuilkCreateSampleInventories.js
$ node deleteAllAndBuilkCreateSampleUsers.js
```

The expected result is to create sample users and inventories in MySQL database, which are needed by the automated test script

#### Run Inventory microservice in a separated terminal
```
$ cd mvp-1

$ yarn start-inventory
or 
#$ npm run start-inventory
```

#### Run Syslog microservice in a separated terminal
```
$ cd mvp-1

$ yarn start-syslog
or
$ npm run start-syslog
```

#### Run automated test script

Run the following cmd in ```PROJECT_ROOT_FOLDER/mvp-1```

```
$ cd mvp-1

$ yarn test
or
$ npm test
```

Note that the test script will start API gateway server automatically during the test automation. 

Expected test result 
```
 PASS  gateway/tests/sample.test.js
  MVP0 testset
    ✓ GW GET / (37 ms)
    ✓ GW POST /token with wrong user account (40 ms)
    ✓ GW POST /token with valid user account (10 ms)
    ✓ GW GET /secured with empty token (2 ms)
    ✓ GW GET /secured with valid token (8 ms)
    ✓ inventory GET /inventories with empty token (13 ms)
    ✓ inventory GET /inventories with valid token (17 ms)
    ✓ inventory GET /inventory/1 with empty token (3 ms)
    ✓ inventory GET /inventory/1  with valid token (11 ms)
    ✓ syslog GET /syslogs with empty token (8 ms)
    ✓ syslog GET /syslogs with valid token (29 ms)
    ✓ syslog GET /syslog/admin1 with empty token (4 ms)
    ✓ syslog GET /syslog/admin1  with valid token (16 ms)
    ✓ syslog POST /syslog with empty token (12 ms)
    ✓ syslog POST /syslog  with valid token (19 ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Snapshots:   0 total
```

#### Start API gateway manually

```
$ cd mvp-1

$ yarn start-gw
or
$ npm run start-gw
```

# Simplfiied API Gateway Specification

The Demo API Gateway Specification will be offered the document generation service on http://localhost:3000/spec This web content is automatically generated from the declarative proxy configuration, where developers use the generated CURL scripts for testing and reuse them for other industrial relevance setting such as OpenAPI or further code generation services.

![alt text](generatedspec.png "Title")

# MVP-1  Code Review

## The main building blocks

The codebase for the two database-enabled microservices is demonstrated.  The gateway helps handle the proxy operation and return a proper HTTP code when there is a broken communication between the gateway and the microservices.

```
├── mcservices 
    ├── inventory.js
    └── syslog.js
```

MySQL using Sequelize and MongoDB using Mongoose help ease the implementation of database tasks. Reusable database code provided in ```shared``` folder.

```
├── mongodb
│   ├── Connection.js
│   └── SystemLogModel.js
└── mysql
    ├── Connection.js
    ├── InventoryModel.js
    └── UserModel.js
```

## Enhanced proxy configuration 

Documentation is being needed by the development after MPV-1 developed a more concrete API gateway demo and exhibited some properties of the API Gateway Pattern. MVP-1 modified the configuration for promoting an API spec generation service that will be done by the Gateway.

File: gw.js
```
// Adding new microservice instances here
// The extended verison of MVP-0
// Allow HTTP operations
const mvcInstances = [{
    instance: proxy('http://localhost:3001'),
    paths: [],
    tokenRequiredPaths: [{
        method: 'get',
        gwPath: '/inventories',
        mcvPath: '/inventories',
        params: [],
        purpose: 'Find all inventories',
    }, {
        method: 'get',
        gwPath: '/inventory/:id',
        mcvPath: '/inventory',
        params: ['id'],
        purpose: 'Find inventory by id',
    }]
}, {
    instance: proxy('http://localhost:3002'),
    paths: [],
    tokenRequiredPaths: [{
        method: 'get',
        gwPath: '/syslogs',
        mcvPath: '/syslogs',
        params: [],
        purpose: 'Find all syslogs',
    }, {
        method: 'get',
        gwPath: '/syslog/:publisher',
        mcvPath: '/syslog',
        params: ['publisher'],
        purpose: 'Find syslog by publisher',
    }, {
        method: 'post',
        gwPath: '/syslog',
        mcvPath: '/syslog',
        params: ['publisher','category','event','message'],
        purpose: 'Save syslog',
    }]
}]
```

# Considerations for MVP-2

Of course, instead of using several API gateways provided by SaaS providers or several great opensource projects, practicing coding tasks is always fun. There are requirements that potential for the next MVP

## Limiters 

Network controllers that help limit unwanted traffic or threats to access the computing resources are important for commercial service.  For example, ACL, Rate limit, and Cache service. Architecture design can help manage this as a plugin.

## SaaS service enablers

Accounting the API usage is beneficial to both system monitoring and service cost calculation. The billing service will require the usage data.

## Timeseries database

System log service that works in conjunction with a time-series database will enhance tech ops and visibility to understand technical aspects

## 3rd Service Integration 

There are a number of great software systems that offer simplicity to API gateway users.

## Connectivity

Restful is just the one of data protocols provided by MVP-1. By enabling the gateway more useful for domain-specific use, NON-HTTP protocols can be considered.     
