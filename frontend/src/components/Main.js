import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { CSVLink } from "react-csv";
import Papa from 'papaparse';

function Main (props) {

    const [openAdd, setOpenAdd] = useState(false);
    const [filterState, setFilterState] = useState('nikto');
    const [minCas, setMinCas] = useState('0001-01-01');
    const [maxCas, setMaxCas] = useState('9999-12-31');
    const [csvData, setCsvData] = useState([]);

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
                exportMerania(data.list);
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
                updateMerania(data.list);
                exportMerania(data.list);
        });
    }

    function updateMerania(tableData){
        for (const el of tableData){
            el.datum = el.datum.slice(0, 10);
        }
        tableData.sort(function(a,b){
            var [year, month, day] = a.datum.split('-');
            const date1 = new Date(+year, month - 1, +day);
            
            var [year, month, day] = b.datum.split('-');
            const date2 = new Date(+year, month - 1, +day);

            return date1 - date2;
        });

        var table = document.getElementById('merania-table');
        const toDelete = document.querySelectorAll('.made');
        toDelete.forEach(row => {
            row.remove();
          });
        
        var i = 0;
        for (const el of tableData){
            if (el.metoda === filterState || filterState === 'nikto'){
                var min = new Date(minCas);
                var max = new Date(maxCas);
                var toto = new Date(el.datum);
                if(min - toto <= 0 && max - toto >= 0) {
                    var row = table.insertRow(i+1);
                    row.classList.add(el.metoda, "made");
                    row.id = ""+(i+1)+""
                    
                    var cislo = row.insertCell(0);
                    cislo.innerHTML = ""+(i+1)+""
                    cislo.className = "made"
                    var datum = row.insertCell(1);
                    datum.innerHTML = el.datum
                    datum.className = "made"
                    var hodnota = row.insertCell(2);
                    hodnota.innerHTML = el.hodnota
                    hodnota.className = "made"
                    var typ = row.insertCell(3);
                    typ.innerHTML = el.typ
                    typ.className = "made"
                    var metoda = row.insertCell(4);
                    metoda.innerHTML = el.metoda
                    metoda.className = "made"
                    i++;
                }
            }
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
                updateMerania(data.list)
                exportMerania(data.list);
            });
    }

    function filter(){
        setFilterState(getInput('filter-input'));
    }

    function resetFilter(){
        setFilterState('nikto');
    }

    function cas(){
        setMinCas(getInput('min-input'));
        setMaxCas(getInput('max-input'));
    }

    function resetCas(){
        setMinCas('0001-01-01');
        setMaxCas('9999-12-31');
    }

    function exportMerania(list){
        var vysledok = [["date", "value", "typ", "method"]]
        list.forEach((el) => {
            let temp = [];
            temp.push(el.datum);
            temp.push(el.hodnota);
            temp.push(el.typ);
            temp.push(el.metoda);
            vysledok.push(temp);
        })
        setCsvData(vysledok);
    }

    const importFile = (event) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
            console.log(results);
            results.data.forEach(v => {v.id = props.id});
            console.log(results.data);
            fetch('http://localhost:8000/import',{
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
                updateMerania(data.list);
                exportMerania(data.list);
            });
            },
        })
    }

    function vyberData(){
        var table = document.getElementById('merania-table');
        var rows = table.childNodes;
        var vysledok = {datasets: [
            {
                label: 'vaha',
                data: []
            },
            {
                label: 'tep',
                data: []
            },
            {
                label: 'kroky',
                data: []
            }
        ]};
        for (let i = 0; i < rows.length; i++){
            let columns = rows[i].childNodes;
            if (columns[3].innerHTML === 'vaha'){
                let rok = columns[1].innerHTML
                rok = rok.split('-');
                rok.forEach((e) => {
                    e = parseInt(e);
                })
                let cislo = parseInt(rok[0]) + (rok[1]/12)
                vysledok.datasets[0].data.push({
                    //x: cislo,
                    x: columns[1].innerHTML,
                    y: columns[2].innerHTML
                })
            }else if (columns[3].innerHTML === 'tep') {
                vysledok.datasets[1].data.push({
                    x: columns[1].innerHTML,
                    y: columns[2].innerHTML
                })
            }else if (columns[3].innerHTML === 'kroky') {
                vysledok.datasets[2].data.push({
                    x: columns[1].innerHTML,
                    y: columns[2].innerHTML
                })
            }
        }

        return vysledok;
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
                    Napis nazov metody podla ktorej chces filtrovat: 
                    <input id="filter-input"></input>
                    <button onClick={filter}>FILTER</button>
                    <button onClick={resetFilter}>Reset filter</button>
                    <br></br>
                    Zadaj casovy rozsah tabulky a grafu: 
                    MIN: 
                    <input id="min-input" type="date"></input>
                    MAX: 
                    <input id="max-input" type="date"></input>
                    <button onClick={cas}>FILTER</button>
                    <button onClick={resetCas}>Reset filter</button>
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
                    <CSVLink data={csvData}>EXPORT MERANIA</CSVLink>
                    <br></br>
                    <input type="file" name='file' accept='.csv' id='import-file-input' onChange={importFile}></input>
                    <h3>Graf váha</h3>
                    <div>
                        <canvas id="myChart1"></canvas>
                    </div>
                    <h3>Graf tep</h3>
                    <div>
                        <canvas id="myChart2"></canvas>
                    </div>
                    <h3>Graf kroky</h3>
                    <div>
                        <canvas id="myChart3"></canvas>
                    </div>
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
                    Napis nazov metody podla ktorej chces filtrovat: 
                    <input id="filter-input"></input>
                    <button onClick={filter}>FILTER</button>
                    <button onClick={resetFilter}>Reset filter</button>
                    <br></br>
                    Zadaj casovy rozsah tabulky a grafu:
                    MIN: 
                    <input id="min-input" type="date"></input>
                    MAX: 
                    <input id="max-input" type="date"></input>
                    <button onClick={cas}>FILTER</button>
                    <button onClick={resetCas}>Reset filter</button>
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
                    <CSVLink data={csvData}>EXPORT MERANIA</CSVLink>
                    <br></br>
                    <input type="file" name='file' accept='.csv' id='import-file-input' onChange={importFile}></input>
                    <h3>Graf váha</h3>
                    <div>
                        <canvas id="myChart1"></canvas>
                    </div>
                    <h3>Graf tep</h3>
                    <div>
                        <canvas id="myChart2"></canvas>
                    </div>
                    <h3>Graf kroky</h3>
                    <div>
                        <canvas id="myChart3"></canvas>
                    </div>
                    <button onClick={click}>LOGOUT</button>
                </div>
            );
        }
    }else{
        return
    }
}

export default Main