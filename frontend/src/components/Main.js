import { useEffect, useState } from 'react';

function Main (props) {

    const [openAdd, setOpenAdd] = useState(false);

    function getInput(id){
        return document.getElementById(id).value
    }

    function getRadio(name){
        return document.querySelector('input[name="'+name+'"]:checked').value;
    }

    function closeAdd(){
        setOpenAdd(false)
    }

    function click1(){
        if (openAdd){
            fetch('http://localhost:8000/meranie',{
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
                    id: props.id,
                    date: getInput('datum-input'),
                    value: getInput('hodnota-input'),
                    typ: getRadio('typ'),
                    method: getRadio('metoda'),
                })
            }).then(data => data.json()).then(data => {
                updateMerania(data.list);
            });
            setOpenAdd(false)
        }else{
            setOpenAdd(true)
            fetch('http://localhost:8000/getmetoda',{
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
                    id: props.id,
                })
            }).then(data => data.json()).then(data => {
                console.log(data)
                updateMetody(data.list)
            });
        }
    }

    function getMerania(){
        fetch('http://localhost:8000/getmeranie',{
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
                    id: props.id,
                })
            }).then(data => data.json()).then(data => {
                updateMerania(data.list)
        });
    }

    function updateMerania(tableData){
        var table = document.getElementById('merania-table');
        const toDelete = document.querySelectorAll('.made');
        toDelete.forEach(row => {
            row.remove();
          });
      
        for (let i = 0; i < tableData.length; i++){
            var row = table.insertRow(i+1);
            row.className = "made"
            row.id = ""+(i+1)+""
            
            var cislo = row.insertCell(0);
            cislo.innerHTML = ""+(i+1)+""
            cislo.className = "made"
            var datum = row.insertCell(1);
            datum.innerHTML = tableData[i].datum.slice(0, 10)
            datum.className = "made"
            var hodnota = row.insertCell(2);
            hodnota.innerHTML = tableData[i].hodnota
            hodnota.className = "made"
            var typ = row.insertCell(3);
            typ.innerHTML = tableData[i].typ
            typ.className = "made"
            var metoda = row.insertCell(4);
            metoda.innerHTML = tableData[i].metoda
            metoda.className = "made"
        }
     }

    function updateMetody(list){
       const container = document.getElementById("metody-container");
       while (container.firstChild) {
        container.removeChild(container.lastChild);
      }
       list.forEach(element => {
            var radio = document.createElement('input');
            radio.type = "radio";
            radio.name = "metoda";
            radio.value = element.nazov;
            radio.id = element.nazov+"-input";
            var label = document.createElement('label');
            label.innerHTML = element.nazov;
            label.for = element.nazov+"-input";
            console.log(container);
            container.appendChild(radio);
            container.appendChild(label);
       });
    }

    function click2(){
        if (openAdd){
            fetch('http://localhost:8000/metoda',{
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
                    id: props.id,
                    nazov: getInput('nazov-input'),
                    popis: getInput('popis-input'),
                })
            }).then(data => data.json()).then(data => {
                console.log(data)
                updateMetody(data.list)
            });
        }else{
            setOpenAdd(true)
            fetch('http://localhost:8000/getmetoda',{
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
                    id: props.id,
                })
            }).then(data => data.json()).then(data => {
                console.log(data)
                updateMetody(data.list)
            });
        }
    }

    function zmazatMetodu(){
        fetch('http://localhost:8000/delmetoda',{
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
                    id: props.id,
                    nazov: getInput('zmazat-metodu-input'),
                })
            }).then(data => data.json()).then(data => {
                console.log(data)
                updateMetody(data.list)
            });
    }

    function getHodnoty(parent){
        var list = [];
        for (const child of parent.children) {
            list.push(child.innerHTML);
        }
        return list;
    }

    function zmazatMeranie(){
        var list = getHodnoty(document.getElementById(getInput("zmazat-meranie-input")));
        console.log(list)
        fetch('http://localhost:8000/delmeranie',{
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
                    id: props.id,
                    datum: list[1],
                    hodnota: list[2],
                    typ: list[3],
                    metoda: list[4],
                })
            }).then(data => data.json()).then(data => {
                console.log(data)
                updateMerania(data.list)
            });
    }

    function click(){
        props.logout()
    }
    if (props.mainOpen){
        if (openAdd){
            return (
                <div>
                    <h1>MAIN PAGE id: {props.id}</h1>
                    VYPLN VSETKY OKIENKA A VLOZ MERANIE
                    <br></br>
                    Datum: 
                    <input type="date" id="datum-input"></input>
                    <br></br>
                    Hodnota: 
                    <input type="number" id="hodnota-input"></input>
                    <br></br>
                    Typ: 
                    <input type="radio" name="typ" value="vaha" id="vaha-input"></input>
                    <label for="vaha-input">Vaha</label>
                    <input type="radio" name="typ" value="tep" id="tep-input"></input>
                    <label for="tep-input">Tep</label>
                    <input type="radio" name="typ" value="kroky" id="kroky-input"></input>
                    <label for="kroky-input">Kroky</label>
                    <br></br>
                    Metoda: 
                    <form id="metody-container"></form>
                    <br></br>
                    <button onClick={click1}>Vlozit meranie</button>
                    <br></br>
                    VYPLN VSETKY OKIENKA A VLOZ METODU
                    <br></br>
                    Nazov:
                    <input id="nazov-input"></input>
                    <br></br>
                    Popis:
                    <textarea id="popis-input"></textarea>
                    <br></br>
                    <button onClick={click2}>Vlozit metodu</button>
                    <br></br>
                    Napis nazov metody, ktoru chces zmazat: 
                    <input id="zmazat-metodu-input"></input>
                    <br></br>
                    <button onClick={zmazatMetodu}>ZMAZAT</button>
                    <br></br>
                    <button onClick={closeAdd}>CLOSE</button>
                    <br></br>
                    <h3>Tvoje merania</h3>
                    <table id="merania-table" onClick={getMerania()}>
                        <tr>
                            <th>Cislo</th>
                            <th>Date</th>
                            <th>Hodnota</th>
                            <th>Typ</th>
                            <th>Metoda</th>
                        </tr>
                    </table>
                    Napis cislo riadku merania, ktore chces vymazat: 
                    <input id="zmazat-meranie-input"></input>
                    <button onClick={zmazatMeranie}>ZMAZAT</button>
                    <br></br>
                    <button onClick={click}>LOGOUT</button>
                </div>
            );
        }else{
            return (
                <div>
                    <h1>MAIN PAGE id: {props.id}</h1>
                    <button onClick={click1}>Vlozit meranie</button>
                    <button onClick={click2}>Vlozit metodu</button>
                    <br></br>
                    <h3>Tvoje merania</h3>
                    <table id="merania-table" onClick={getMerania()}>
                        <tr>
                            <th>Cislo</th>
                            <th>Date</th>
                            <th>Hodnota</th>
                            <th>Typ</th>
                            <th>Metoda</th>
                        </tr>
                    </table>
                    Napis cislo riadku merania, ktore chces vymazat: 
                    <input id="zmazat-meranie-input"></input>
                    <button onClick={zmazatMeranie}>ZMAZAT</button>
                    <br></br>
                    <button onClick={click}>LOGOUT</button>
                </div>
            );
        }
        
    }else{
        return
    }
    
}

export default Main