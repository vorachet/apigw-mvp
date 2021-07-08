require('dotenv').config({
    path: __dirname + "/../.env"
})
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const proxy = require('./proxy')
const router = require('./router')

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenInfo) => {
        req.tokenInfo = tokenInfo
        if (err) return res.sendStatus(403)
        next()
    })
}

app.get('/', (req, res) => {
    res.send("Gateway OK")
})

app.get('/secured', authenticateToken, (req, res) => {
    res.json(req.tokenInfo)
})

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

function buildProxyParams(path, req) {
    const params = path.gwPath.split("/")
                    .filter(t=>t.includes(':'))
                    .map(p=>p.replace(':',''))
    const proxyParams = params.map(p=> {
        return req.params[p]
    }).join("/")
    const proxyUrl = path.mcvPath + (proxyParams.length > 0 ? "/" + proxyParams : "")
    return proxyUrl
}

mvcInstances.map(inst => {
    inst.paths.map(path => {
        if (path.method === 'get') {
            app.get(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                inst.instance.get(proxyUrl).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }

        if (path.method === 'post') {
            app.post(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                inst.instance.post(proxyUrl, req.body).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }

        if (path.method === 'put') {
            app.put(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                inst.instance.put(proxyUrl, req.body).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }

        if (path.method === 'delete') {
            app.delete(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                inst.instance.delete(proxyUrl, req.body).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }
    
    })
    inst.tokenRequiredPaths.map(path => {
        if (path.method === 'get') {
            app.get(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                let config = {
                    headers: req.headers
                }
                inst.instance.get(proxyUrl, config).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }

        if (path.method === 'post') {
            app.post(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                let config = {
                    headers: req.headers
                }
                inst.instance.post(proxyUrl, req.body, config).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }

        if (path.method === 'put') {
            app.put(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                let config = {
                    headers: req.headers
                }
                inst.instance.put(proxyUrl, req.body, config).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }

        if (path.method === 'delete') {
            app.delete(path.gwPath, (req, res) => {
                const proxyUrl = buildProxyParams(path, req)
                let config = {
                    headers: req.headers
                }
                inst.instance.delete(proxyUrl, req.body, config).then(resp => {
                    res.send(resp.data)
                }).catch(error => {
                    res.status(401)
                    res.send('')
                });
            })
        }
    })
})

app.use(router)


app.get('/spec', (req, res) => {
    const urls = [{
        secured: false,
        method: 'get',
        path: '/',
        purpose: 'Healthy check',
        curl: 'curl http://localhost:3000'
    },{
        secured: true,
        method: 'get',
        path: '/secured',
        purpose: 'JWT testing purpose',
        curl: `curl -H "Authorization: Bearer <span class="token">YOUR_TOKEN</span>" http://localhost:3000/secured`
    }, {
        secured: false,
        method: 'post',
        path: '/token',
        params: ['username', 'password','expiresIn'],
        purpose: 'Generate JWT token.',
        curl: `curl -w "\\n" -d "username=admin1&password=password&expiresIn=1d" http://localhost:3000/token` 
    }]

    mvcInstances.map(inst => {
        const paths = inst.paths.map(path => {
            let curl;
            if (path.method === 'get') {
                curl = `curl http://localhost:3000${path.gwPath}`
            }
            if (path.method === 'post') {
                curl = `curl ${path.params.length>0 ? '-d "' : ''}${path.params.map(p=> p + '=Value').join('&')}${path.params.length>0 ? '"' : ''} http://localhost:3000${path.gwPath}` 
            }
            if (path.method === 'put') {
                curl = `curl ${path.params.length>0 ? '-d "' : ''}${path.params.map(p=> p + '=Value').join('&')}${path.params.length>0 ? '"' : ''} -X PUT http://localhost:3000${path.gwPath}` 
            }
            if (path.method === 'delete') {
                curl = `curl -X DELETE http://localhost:3000${path.gwPath}` 
            }
            urls.push({
                secured: false,
                method: path.method,
                path: path.gwPath,
                purpose: path.purpose,
                params: path.params,
                curl: curl
            })
        })
    
        const tokenRequiredPaths = inst.tokenRequiredPaths.map(path => {
            let curl;
            if (path.method === 'get') {
                curl = `curl -H "Authorization: Bearer <span class="token">YOUR_TOKEN</span>" http://localhost:3000${path.gwPath}`
            }
            if (path.method === 'post') {
                curl = `curl -H "Authorization: Bearer <span class="token">YOUR_TOKEN</span>" ${path.params.length>0 ? '-d "' : ''}${path.params.map(p=> p + '=Value').join('&')}${path.params.length>0 ? '"' : ''} http://localhost:3000${path.gwPath}` 
            }
            if (path.method === 'put') {
                curl = `curl -H "Authorization: Bearer <span class="token">YOUR_TOKEN</span>" ${path.params.length>0 ? '-d "' : ''}${path.params.map(p=> p + '=Value').join('&')}${path.params.length>0 ? '"' : ''} -X PUT http://localhost:3000${path.gwPath}` 
            }
            if (path.method === 'delete') {
                curl = `curl -H "Authorization: Bearer <span class="token">YOUR_TOKEN</span>" -X DELETE http://localhost:3000${path.gwPath}` 
            }
            urls.push({
                secured: true,
                method: path.method,
                path: path.gwPath,
                purpose: path.purpose,
                params: path.params,
                curl: curl
            })
        })
    })

    const text = urls.map(u=>{
        return `<p>
            <b>${u.secured ? '<span style="color:red;">Token required</span>' : '<span style="color:green;">Public</span>'} - ${u.purpose}</b> <br>
            <b>${u.method.toUpperCase()} ${u.path} </b><br>
            Params: ${u.params && u.params.length > 0 ? u.params : 'not required'}
            <p>
            ${u.curl}
            </p>
        </p>`
    }).join('<hr>')
    res.send(`
    <html>
    <style>
      body {
        padding: 50
      }
    </style>
    <script>
    function setToken() {
        console.log('setToken')
        x = document.getElementsByClassName("token");
        t = document.getElementById("tokenstring");
        for(var i = 0; i < x.length; i++){
            x[i].innerText=t.value;
        }
    }
    </script>
    <body>
    <h1>API Gateway</h1>
    <input type="text" id="tokenstring" value="Your token"/>
    <button onclick="setToken()">Set Token</button>
    ${text}
    </body>
    </html>
    `)
})

// required by multiple jest/supertest tests 
if (process.env.NODE_ENV !== 'test') {
    app.listen(3000);
    console.log("gateway http://localhost:3000")
}

module.exports = app