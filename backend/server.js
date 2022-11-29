const express = require('express');
const app = express();
const path = require('path'); 
const fs = require('fs');

const pg = require('pg');
const client = new pg.Client('postgres://postgres:admin@db:5432/users');
client.connect();

const port = 8000;

var activeUserId;

app.use(express.static(path.join(__dirname, 'build')));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post("/func", function(req, res) {
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })

    req.on('end', ()=>{
        const resData = chunks.join('');
        console.log(resData);
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        console.log(jData);
            client.query('INSERT INTO users (email,name,password,vek,vyska) VALUES (\''+jData.email+'\',\''+jData.name+'\',\''+jData.password+'\',\''+parseInt(jData.vek)+'\',\''+parseInt(jData.vyska)+'\') ON CONFLICT (email) DO NOTHING;').then((results) => {
                if (results.rowCount == 1){
                    client.query('SELECT id FROM users WHERE email=\''+jData.email+'\' ORDER BY id DESC LIMIT 1').then((response) => {
                        res.send(JSON.stringify({'id': response.rows[0].id}))
                    }).catch(e => {
                        res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
                    });
                }else{
                    res.send(JSON.stringify({'id': 'zle'}))
                }
                
            }).catch(e => {
                res.end(JSON.stringify({'err':'DB went wrong - '+e}));
            });
        }
    );
})

app.post("/user", function(req, res) {
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        if (jData.email === 'admin' && jData.password === 'admin'){
            res.send(JSON.stringify({'err': 'admin'}))
        }else{
            client.query('SELECT id, password FROM users WHERE email=\''+jData.email+'\' ORDER BY id DESC LIMIT 1').then((response) => {
                if (jData.password === response.rows[0].password){
                    res.send(JSON.stringify({'id': response.rows[0].id}))
                }else{
                    res.send(JSON.stringify({'err': 'zle heslo'}))
                }
            }).catch(e => {
                res.end(JSON.stringify({'err':'zly email'}));
            });
        }
    })
})

app.post("/meranie", function(req, res) {
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        console.log(jData);
    })
    res.send(JSON.stringify({message: "mam to"}))
})

app.get("/users", function(req, res) {
    client.query('SELECT * FROM users').then((response) => {
        res.send(JSON.stringify(response.rows))
    }).catch(e => {
        console.log(e);
    });
})

app.post("/del", function(req, res) {
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        client.query('DELETE FROM users WHERE id=\''+jData.id+'\'');
        client.query('SELECT * FROM users').then((response) => {
            res.send(JSON.stringify(response.rows))
        }).catch(e => {
            console.log(e);
        });
    })
})

app.post("/import", function(req, res){
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        client.query('COPY users(email, name, password, vek, vyska) FROM \''+jData.path+'\' DELIMITER ',' CSV HEADER ON CONFLICT DO NOTHING;');
        client.query('SELECT * FROM users').then((response) => {
            res.send(JSON.stringify(response.rows))
        }).catch(e => {
            console.log(e);
        });
    })
})

app.get("/export", function(req, res){
    var file = 'users.csv'
    fs.open(file, 'w', (err, f) => {
        if (err) throw err;
        else {
            //file = path.resolve(file)
            //console.log(file)
            //client.query('COPY users TO \''+file+'\' DELIMITER \',\' CSV HEADER;');
            //console.log('Saved!');
            res.send(JSON.stringify({message: file}));
        }
    });
})

app.get("/reklama", function(req, res){
        client.query('SELECT * FROM reklama ORDER BY id ASC').then((response) => {
            res.send(JSON.stringify({list: response.rows}))
        }).catch(e => {
            console.log(e);
        });
})

app.post("/pocet", function(req, res){
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        client.query('UPDATE reklama SET pocet = pocet+1 WHERE id=\''+jData.id+'\';')
    })
})

app.post("/reklama", function(req, res){
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        if (jData.link === ''){
            client.query('UPDATE reklama SET obrazok = \''+jData.obrazok+'\' WHERE id=\''+jData.id+'\';')
        }else{
            client.query('UPDATE reklama SET link = \''+jData.link+'\' WHERE id=\''+jData.id+'\';')
        }
        res.end(JSON.stringify({message: "fajn"}))
    })
})

app.post("/metoda", function(req, res){
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        client.query('INSERT INTO metody (nazov, popis) VALUES (\''+jData.nazov+'\',\''+jData.popis+'\') ON CONFLICT (nazov) DO NOTHING;').then((results) => {
            if (results.rowCount == 1){
                client.query('SELECT nazov FROM metody ORDER BY id ASC').then((response) => {
                    console.log(response)
                    res.send(JSON.stringify({'list': response.rows}))
                }).catch(e => {
                    res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
                });
            }else{
                res.send(JSON.stringify({'id': 'zle'}))
            }
        })
    })
})

app.get("/metoda", function(req, res){
    client.query('SELECT nazov FROM metody ORDER BY id ASC').then((response) => {
        console.log(response)
        res.send(JSON.stringify({'list': response.rows}))
    })
})

app.post("/delmetoda", function(req, res){
    let chunks = [];

    req.on('data', (data)=> {
        chunks.push(data);
    })
    req.on('end', ()=>{
        const resData = chunks.join('');
        let jData = {};
        try {
            jData = JSON.parse(resData);
        } catch(e) {
            console.error(e);
        }
        client.query('DELETE FROM metody WHERE nazov=\''+jData.nazov+'\'');
        client.query('SELECT nazov FROM metody ORDER BY id ASC').then((response) => {
            res.send(JSON.stringify({'list': response.rows}))
        }).catch(e => {
            console.log(e);
        });
    })
})

app.listen(port)