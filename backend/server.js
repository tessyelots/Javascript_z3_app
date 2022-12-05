const express = require('express');
const app = express();
const path = require('path'); 
const fs = require('fs');

//pripojenie k databaze
const pg = require('pg');
const client = new pg.Client('postgres://postgres:admin@db:5432/postgres');
setTimeout(() => {
    client.connect();
  }, 2000)


const port = 8080;

app.use(express.static(path.join(__dirname, 'build')));

//index.html
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//vytvorenie usera pri registracii
app.post("/func", function(req, res) {
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
    });
})

//kontrola udajov pri prihlasovani usera
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

//vlozenie merania do databazy a vratenie vsetkych merani clientovi
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
        client.query('INSERT INTO '+jData.typ+' (user_id, datum, hodnota, metoda) VALUES (\''+parseInt(jData.id)+'\',\''+jData.date+'\',\''+jData.value+'\',\''+jData.method+'\');').then(() => {
            var list1;
            var list2;
            client.query('SELECT * FROM vaha WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
                list1 = response.rows;
                list1.forEach(v => {v.typ = 'vaha';});
            }).catch(e => {
                res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
            });
            client.query('SELECT * FROM tep WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
                list2 = response.rows;
                list2.forEach(v => {v.typ = 'tep';});
            }).catch(e => {
                res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
            });
            
            client.query('SELECT * FROM kroky WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
                var list3 = response.rows;
                list3.forEach(v => {v.typ = 'kroky';});
                res.send(JSON.stringify({'list': list3.concat(list1, list2)}));
            }).catch(e => {
                res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
            });
        });
    })
    
})

//posle vsetky merania clientovi
app.post("/getmeranie", function(req, res) {
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
        var list1;
        var list2;
        client.query('SELECT * FROM vaha WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
            list1 = response.rows;
            list1.forEach(v => {v.typ = 'vaha';});
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });

        client.query('SELECT * FROM tep WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
            list2 = response.rows;
            list2.forEach(v => {v.typ = 'tep';});
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });
        
        client.query('SELECT * FROM kroky WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
            var list3 = response.rows;
            list3.forEach(v => {v.typ = 'kroky';});
            res.send(JSON.stringify({'list': list3.concat(list1, list2)}));
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });
    });
})

//posle vsetkych userov clientovi
app.get("/users", function(req, res) {
    client.query('SELECT * FROM users').then((response) => {
        res.send(JSON.stringify(response.rows))
    }).catch(e => {
        console.log(e);
    });
})

//vymazanie usera z databazy a vratenie vsetkych userov
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

//ulozenie importovanych merani do databazy a vratenie vsetkych merani
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
        jData.data.forEach((el) => {
            client.query('INSERT INTO '+el.typ+' (user_id,datum,hodnota,metoda) VALUES (\''+el.id+'\',\''+el.date+'\',\''+el.value+'\',\''+el.method+'\')')
        })
        var list1;
        var list2;
        client.query('SELECT * FROM vaha WHERE user_id=\''+parseInt(jData.data[0].id)+'\'').then((response) => {
            list1 = response.rows;
            list1.forEach(v => {v.typ = 'vaha';});
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });

        client.query('SELECT * FROM tep WHERE user_id=\''+parseInt(jData.data[0].id)+'\'').then((response) => {
            list2 = response.rows;
            list2.forEach(v => {v.typ = 'tep';});
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });
        
        client.query('SELECT * FROM kroky WHERE user_id=\''+parseInt(jData.data[0].id)+'\'').then((response) => {
            var list3 = response.rows;
            list3.forEach(v => {v.typ = 'kroky';});
            res.send(JSON.stringify({'list': list3.concat(list1, list2)}));
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });
    })
})

//ulozenie importovanych userov do databazy a vratenie vsetkych userov
app.post("/importusers", function(req, res){
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
        jData.data.forEach((el) => {
            client.query('INSERT INTO users (email,name,password,vek,vyska) VALUES (\''+el.email+'\',\''+el.name+'\',\''+el.password+'\',\''+el.vek+'\',\''+el.vyska+'\') ON CONFLICT (email) DO NOTHING;')
        })
        client.query('SELECT * FROM users').then((response) => {
            res.send(JSON.stringify(response.rows))
        }).catch(e => {
            console.log(e);
        });
    })
})

//poslanie dat reklam clientovi
app.get("/reklama", function(req, res){
        client.query('SELECT * FROM reklama ORDER BY id ASC').then((response) => {
            res.send(JSON.stringify({list: response.rows}))
        }).catch(e => {
            console.log(e);
        });
})

//zvysenie pocitadla urcitej reklamy
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

//zmena obrazku alebo linku urcitej reklamy v databaze
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

//ulozenie metody do databazy
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
        client.query('INSERT INTO metody (user_id, nazov, popis) VALUES (\''+parseInt(jData.id)+'\',\''+jData.nazov+'\',\''+jData.popis+'\');').then((results) => {
            if (results.rowCount == 1){
                client.query('SELECT nazov FROM metody WHERE user_id=\''+parseInt(jData.id)+'\';').then((response) => {
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

//posle vsetky metody clientovi
app.post("/getmetoda", function(req, res){
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
        client.query('SELECT nazov FROM metody WHERE user_id=\''+parseInt(jData.id)+'\';').then((response) => {
            res.send(JSON.stringify({'list': response.rows}))
        })
    })
})

//vymazanie metody z databazy a vratenie vsetkych metod
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
        client.query('DELETE FROM metody WHERE nazov=\''+jData.nazov+'\' AND user_id=\''+jData.id+'\'');
        client.query('SELECT nazov FROM metody WHERE user_id=\''+parseInt(jData.id)+'\';').then((response) => {
            res.send(JSON.stringify({'list': response.rows}))
        }).catch(e => {
            console.log(e);
        });
    })
})

//vymazanie merania z databazy a vratenie vsetkych merani
app.post("/delmeranie", function(req, res) {
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
        client.query('DELETE FROM '+jData.typ+' WHERE user_id=\''+jData.id+'\' AND datum=\''+jData.datum+'\' AND hodnota=\''+jData.hodnota+'\' AND metoda=\''+jData.metoda+'\';');
        var list1;
        var list2;
        client.query('SELECT * FROM vaha WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
            list1 = response.rows;
            list1.forEach(v => {v.typ = 'vaha';});
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });

        client.query('SELECT * FROM tep WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
            list2 = response.rows;
            list2.forEach(v => {v.typ = 'tep';});
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });
        
        client.query('SELECT * FROM kroky WHERE user_id=\''+parseInt(jData.id)+'\'').then((response) => {
            var list3 = response.rows;
            list3.forEach(v => {v.typ = 'kroky';});
            res.send(JSON.stringify({'list': list3.concat(list1, list2)}));
        }).catch(e => {
            res.end(JSON.stringify({'err':'DB went wrong - '+e,'mem':''}));
        });
    })
})

app.listen(port)