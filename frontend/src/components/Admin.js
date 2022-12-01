import { CSVLink } from "react-csv";
import Papa from 'papaparse';
import {useState} from 'react';

function Admin(props){

    const [csvData, setCsvData] = useState([]);

    function click(){
        props.logout()
    }

    function getInput(id) {
        return document.getElementById(id).value
    }

    function clearInputs(){
        document.getElementById('email-input').value = ''
        document.getElementById('name-input').value = ''
        document.getElementById('password-input').value = ''
        document.getElementById('vek-input').value = ''
        document.getElementById('vyska-input').value = ''
    }

    function make(){
        fetch('http://localhost:8000/func',{
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    email: getInput('email-input'),
                    name: getInput('name-input'),
                    password: getInput('password-input'),
                    vek: getInput('vek-input'),
                    vyska: getInput('vyska-input'),
                })
            }).then(data => data.json()).then(data => {
                if (data.id === "zle") {
                    alert("Tento email je uz zaregistrovany")
                }else{
                    clearInputs()
                    getUsers()
                }
        });
    }

    function getUsers(){
        fetch('http://localhost:8000/users',{
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            }).then(data => data.json()).then(data => {
                updateTable(data)
                exportUsers(data)
        });
    }

    function updateTable(tableData) {
        var table = document.getElementById('users-table');
        const toDelete = document.querySelectorAll('.made');
        toDelete.forEach(row => {
            row.remove();
          });
      
        for (let i = 0; i < tableData.length; i++){
            var row = table.insertRow(i+1);
            row.className = ".made"
      
            var id = row.insertCell(0);
            id.innerHTML = tableData[i].id
            id.className = "made"
            var email = row.insertCell(1);
            email.innerHTML = tableData[i].email
            email.className = "made"
            var name = row.insertCell(2);
            name.innerHTML = tableData[i].name
            name.className = "made"
            var password = row.insertCell(3);
            password.innerHTML = tableData[i].password
            password.className = "made"
            var vek = row.insertCell(4);
            vek.innerHTML = tableData[i].vek
            vek.className = "made"
            var vyska = row.insertCell(5);
            vyska.innerHTML = tableData[i].vyska
            vyska.className = "made"
        }
    };

    function zmazat(){
        var id = document.getElementById('zmazat').value
        if (id != undefined){
            fetch('http://localhost:8000/del',{
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    id: id
                })
            }).then(data => data.json()).then(data => {
                updateTable(data)
                exportUsers(data)
            });
        }
    }

    const importUsers = (event) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
            console.log(results);
            fetch('http://localhost:8000/importusers',{
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(results)
            }).then(data => data.json()).then(data => {
                updateTable(data.list);
                exportUsers(data.list);
            });
            },
        })
        document.getElementById('import-users-input').value = "";
    }

    function zmenObrazok(){
        var id = document.getElementById('id-input').value
        var obrazok = document.getElementById('obrazok-input').value
        fetch('http://localhost:8000/reklama',{
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    id: id,
                    obrazok: obrazok,
                    link: '',
                })
            }).then(data => data.json()).then(data => {
                props.updateImages()
            });
    }

    function zmenLink(){
        var id = document.getElementById('id-input').value
        var link = document.getElementById('link-input').value
        fetch('http://localhost:8000/reklama',{
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    id: id,
                    obrazok: '',
                    link: link,
                })
            }).then(data => data.json()).then(data => {
                props.updateImages()
            });
    }

    function exportUsers(list){
        var vysledok = [["id", "email", "name", "password", "vek", "vyska"]]
        list.forEach((el) => {
            let temp = [];
            temp.push(el.id);
            temp.push(el.email);
            temp.push(el.name);
            temp.push(el.password);
            temp.push(el.vek);
            temp.push(el.vyska);
            vysledok.push(temp);
        })
        setCsvData(vysledok);
    }

    if (props.adminOpen){
        return (<div>
            <h1>ADMIN</h1>
            Vytvorit popuzivatela:
            <br></br>
                Email: 
                <input type="email" id="email-input"></input>
                <br></br>
                Meno: 
                <input id="name-input"></input>
                <br></br>
                Heslo: 
                <input type="password" id="password-input"></input>
                <br></br>
                Vek: 
                <input type="number" id="vek-input"></input>
                <br></br>
                Vyska v centimetroch: 
                <input type="number" id="vyska-input"></input>
                <br></br>
                <button onClick={make}>VYTVORIT</button>
                <table id="users-table" onClick={getUsers()}>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Meno</th>
                        <th>Heslo</th>
                        <th>Vek</th>
                        <th>Vyska</th>
                    </tr>
                </table>
            Zadaj ID usera:
            <input type="number" id="zmazat"></input>
            <button id="zmazat-button" onClick={zmazat}>ZMAZAT</button>
            <br></br>
            <CSVLink data={csvData}>EXPORT USERS</CSVLink>
            <br></br>
            <input type="file" name='file' accept='.csv' id='import-users-input' onChange={importUsers}></input>
            <br></br>
            Reklama 1: 
            <img src={props.reklamaImage1} width="100" height="100"/>
            Link: {props.reklamaLink1} Pocet kliknuti: {props.pocet1}
            <br></br>
            Reklama 2: 
            <img src={props.reklamaImage2} width="100" height="100"/>
            Link: {props.reklamaLink2} Pocet kliknuti: {props.pocet2}
            <br></br>
            Reklama 3: 
            <img src={props.reklamaImage3} width="100" height="100"/>
            Link: {props.reklamaLink3} Pocet kliknuti: {props.pocet3}
            <br></br>
            Zadaj id reklamy: 
            <input id="id-input"></input>
            Zadaj link obrazka: 
            <input id="obrazok-input"></input>
            <button onClick={zmenObrazok}>Zmen Obrazok</button>
            Zadaj link: 
            <input id="link-input"></input>
            <button onClick={zmenLink}>Zmen Link</button>
            <button onClick={click}>LOGOUT</button>
        </div>
    )
    }else{
        return 
    }
    
}
export default Admin