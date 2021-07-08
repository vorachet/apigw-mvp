# MVP-0

The capability that needs to be demonstrated 

- Simplified microservices demonstrated by the following nodejs programs

```
                port 3000    
  Client --> API Gateway--> mcv1  port 3001
                       \--> mcv2  port 3002
```

- Simplified JWT authentication offered by Gateway

# Testing

## Intalling node libs
```
yarn install
or 
npm install
```

## Running mcv1 in a separated terminal
```
yarn start-mcv1 
or
node mcv1
```

## Running mcv2 in a separated terminal
```
yarn start-mcv2
or
node mcv2
```

## Testing the API gateway using automated test script

Note that the gateway server runtime will be executed during the e2e test automatically
```
yarn test
or
npm test
```
Expected test result
```
  MVP0 testset
    ✓ GW GET / (18 ms)
    ✓ GW POST /token with wrong user account (12 ms)
    ✓ GW POST /token with valid user account (7 ms)
    ✓ GW GET /secured with empty token (3 ms)
    ✓ GW GET /secured with valid token (24 ms)
    ✓ mcv1 GET / (18 ms)
    ✓ mcv1 GET /secured with empty token (5 ms)
    ✓ mcv1 GET /secured with valid token (10 ms)
    ✓ mcv2 GET / (12 ms)
    ✓ mcv2 GET /secured with empty token (5 ms)
    ✓ mcv2 GET /secured with valid token (8 ms)
```

# Running MVP-0 manually

Running gateway in a separated terminal
```
yarn start-gw
or
node gateway/gw
```

Running mcv1 in a separated terminal
```
yarn start-mcv1 
or
node mcv1
```

Running mcv2 in a separated terminal
```
yarn start-mcv2
or
node mcv2
```

## CURL test scripts 
```
curl http://localhost:3000/

curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjFkdXNlciIsImlhdCI6MTYyNTY1MjQ1MywiZXhwIjoxNzEyMDUyNDUzfQ.vfJ0I1Mg94vKwF6H9LBuWY5FanjAFZXQm1qwAuGesPg" http://localhost:3000/secured

curl http://localhost:3000/mcv1

curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjFkdXNlciIsImlhdCI6MTYyNTY1MjQ1MywiZXhwIjoxNzEyMDUyNDUzfQ.vfJ0I1Mg94vKwF6H9LBuWY5FanjAFZXQm1qwAuGesPg" http://localhost:3000/secured-mcv1


curl http://localhost:3000/mcv2

curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjFkdXNlciIsImlhdCI6MTYyNTY1MjQ1MywiZXhwIjoxNzEyMDUyNDUzfQ.vfJ0I1Mg94vKwF6H9LBuWY5FanjAFZXQm1qwAuGesPg" http://localhost:3000/secured-mcv2

```

# Design Review

### Extending microservices

This codebase intends to use declarative configuration (A) for adding proxy mapping into the system runtime. This helps ease the addition of new microservices that run behind the infrastructure where the actual code for configuring Express's Restful service will be done by (B). This design helps facilitate the next MVP version, where the configuration task can be performed by a subsystem such as a back office or more complex SOA scenarios.

FIle: gw.js
```

(A)
const mvcInstances = [{
    instance: proxy('http://localhost:3001'),
    paths: [{
        gwPath: '/mcv1',
        mcvPath: '/'
    }],
    tokenRequiredPaths: [{
        gwPath: '/secured-mcv1',
        mcvPath: '/secured'
    }]
}, {
    instance: proxy('http://localhost:3002'),
    paths: [{
        gwPath: '/mcv2',
        mcvPath: '/'
    }],
    tokenRequiredPaths: [{
        gwPath: '/secured-mcv2',
        mcvPath: '/secured'
    }]
}]

(B)
mvcInstances.map(inst=> {
    inst.paths.map(path=> {
        app.get(path.gwPath, (req, res) => {
            inst.instance.get(path.mcvPath).then(resp => {
                res.send(resp.data)
            }).catch(error => {
                res.status(401)
                res.send('')
            });
        })
    })
    inst.tokenRequiredPaths.map(path=> {
        app.get(path.gwPath, (req, res) => {
            let config = {
                headers: req.headers
            }
            inst.instance.get(path.mcvPath, config).then(resp => {
                res.send(resp.data)
            }).catch(error => {
                res.status(401)
                res.send('')
            });
        })
    })
})
```