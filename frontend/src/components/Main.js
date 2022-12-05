import { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import Papa from 'papaparse';

function Main (props) {

    const [openAdd, setOpenAdd] = useState(false);
    const [filterState, setFilterState] = useState('nikto');
    const [minCas, setMinCas] = useState('0001-01-01');
    const [maxCas, setMaxCas] = useState('9999-12-31');
    const [csvData, setCsvData] = useState([]);

    //ziskanie value inputu na zaklade jeho id
    function getInput(id){
        return document.getElementById(id).value
    }

    //ziskanie value radio buttonu, ktory je zakliknuty
    function getRadio(name){
        return document.querySelector('input[name="'+name+'"]:checked').value;
    }

    //zatvorenie reklamy
    function closeAdd(){
        setOpenAdd(false)
    }

    //otvori pridavanie merani alebo vytvori meranie v databaze
    function click1(){
        if (openAdd){
            fetch('http://localhost:8080/meranie',{
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
            fetch('http://localhost:8080/getmetoda',{
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
                updateMetody(data.list)
            });
        }
    }

    //vracia vsetky merania prihlaseneho usera
    function getMerania(){
        fetch('http://localhost:8080/getmeranie',{
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
        });
    }

    //aktualizacia tabulky merani
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
        vytvorGrafy();
    }

    //aktualizacia metod
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
            container.appendChild(radio);
            container.appendChild(label);
       });
    }

    //vytvorenie a ulozenie metody do databazy
    function click2(){
        if (openAdd){
            fetch('http://localhost:8080/metoda',{
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
                updateMetody(data.list)
            });
        }else{
            setOpenAdd(true)
            fetch('http://localhost:8080/getmetoda',{
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
                updateMetody(data.list)
            });
        }
    }

    //zmazanie metody
    function zmazatMetodu(){
        fetch('http://localhost:8080/delmetoda',{
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

    //zmazanie merania z databazy
    function zmazatMeranie(){
        var list = getHodnoty(document.getElementById(getInput("zmazat-meranie-input")));
        fetch('http://localhost:8080/delmeranie',{
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
            });
    }

    //nastavenie filtra
    function filter(){
        setFilterState(getInput('filter-input'));
        exportMerania();
    }

    //zrusenie filtra
    function resetFilter(){
        setFilterState('nikto');
        exportMerania();
    }

    //nastavenie casoveho rozsahu
    function cas(){
        setMinCas(getInput('min-input'));
        setMaxCas(getInput('max-input'));
        exportMerania();
    }
    
    //zrusenie casoveho rozsahu
    function resetCas(){
        setMinCas('0001-01-01');
        setMaxCas('9999-12-31');
        exportMerania();
    }

    //aktualizacia useState csvData podla tabulky
    function exportMerania(){
        var vysledok = [["date", "value", "typ", "method"]];
        var table = document.getElementById('merania-table');
        var rows = table.childNodes;

        for (let i = 1; i < rows.length; i++){
            let columns = rows[i].childNodes;
            let temp = [];
            temp.push(columns[1].innerHTML);
            temp.push(columns[2].innerHTML);
            temp.push(columns[3].innerHTML);
            temp.push(columns[4].innerHTML);
            vysledok.push(temp);
        }
        setCsvData(vysledok);
    }

    //ulozenie importovanych merani do databazy
    const importFile = (event) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log(results)
            results.data.forEach(v => {v.id = props.id});
            fetch('http://localhost:8080/import',{
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

    //vybratie dat z csvData
    function vyberHodnoty(typ){
        let max = 0;
        let vysledok = [];
        for (let i = 1; i < csvData.length; i++){
            if (csvData[i][2] === typ) {
                if (parseInt(csvData[i][1]) > max) max = parseInt(csvData[i][1]);
                let temp = csvData[i][0].split('-');
                temp[0] = parseInt(temp[0]);
                temp[1] = parseInt(temp[1]);
                temp[2] = parseInt(temp[2]);
                let rok = temp[0] + ((temp[1]-1)/12) + (temp[2]/373)
                vysledok.push({rok: rok, hodnota: parseInt(csvData[i][1])})
            }
        }

        return [max, vysledok]
    }

    //vytvorenie grafov
    function vytvorGrafy(){
        exportMerania();
        var canvas1 = document.getElementById('myChart1');
        var vaha = vyberHodnoty('vaha');
        var canvas2 = document.getElementById('myChart2');
        var tep = vyberHodnoty('tep');
        var canvas3 = document.getElementById('myChart3');
        var kroky = vyberHodnoty('kroky');

        nakresli(canvas1, vaha[0], vaha[1]);
        nakresli(canvas2, tep[0], tep[1]);
        nakresli(canvas3, kroky[0], kroky[1]);
    }

    //vypocet linearnej regresie
    function suradniceRegresie(data, x){
        var sumaX = 0;
        data.forEach((el) => {
            sumaX += el.rok
        })
        var sumaY = 0;
        data.forEach((el) => {
            sumaY += el.hodnota
        })
        var sumaXY = 0;
        data.forEach((el) => {
            sumaXY += (el.rok*el.hodnota)
        })
        var sumaX2 = 0;
        data.forEach((el) => {
            sumaX2 += (el.rok*el.rok)
        })
        var sumaY2 = 0;
        data.forEach((el) => {
            sumaY2 += el.hodnota*el.hodnota
        })

        var a = ((sumaY*sumaX2)-(sumaX*sumaXY))/((data.length*sumaX2)-(sumaX*sumaX));
        var b = ((data.length*sumaXY)-(sumaX*sumaY))/((data.length*sumaX2)-(sumaX*sumaX));
        var y = (a+b*x);
        return y;
    }

    //nakreslenie grafu
    function nakresli(canvas, max, data){
        if (data.length === 0){
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = '#ff0505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.textAlign = 'center';
            ctx.font = "100px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText("ZIADNE MERANIA", canvas.width/2, canvas.height/2);
        }else{
            var minRok = Math.floor(data[0].rok);
            var maxRok = Math.ceil(data[data.length-1].rok)
            var step = Math.ceil((maxRok - minRok)/8);
            var upraveneData = []
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var inc;
            ctx.beginPath();
            ctx.moveTo(50, 0);
            ctx.lineTo(50, 450);
            ctx.strokeStyle = '#000000';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0,400);
            ctx.lineTo(850, 400);
            ctx.strokeStyle = '#000000';
            ctx.stroke();

            let x = (max / 40);
            if (x < 1) inc = 1;
            else {
                inc = Math.floor(x / 5);
                if (x % 5 !== 0) inc++;
                inc *= 5;
            }

            for (let i = 0; i <= 40; i++){
                ctx.beginPath();
                ctx.moveTo(50, i*10);
                ctx.lineTo(850, i*10);
                ctx.strokeStyle = '#dedede';
                ctx.stroke();
            }

            for (let i = 0; i <= 40; i++){
                ctx.textAlign = 'right';
                ctx.font = "10px Arial";
                ctx.fillStyle = "#000000";
                ctx.fillText(""+(40-i)*inc+"", 49, (i*10)+8);
            }

            for (let i = 0; i <= 8; i++){
                ctx.fillStyle = "#000000";
                ctx.fillText(""+(minRok+i*step)+"", 72+(100*i), 410);
            }


            data.forEach((el) => {
                let x = 51+((el.rok-minRok)*(100/step));
                let y = 400-((el.hodnota/inc)*10);
                upraveneData.push({rok: x, hodnota: y})
                ctx.beginPath();
                ctx.fillStyle = '#ff0505';
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            })

            var i = 0;
            data.forEach((el) => {
                let x = 51+((el.rok-minRok)*(100/step));
                let y = 400-((el.hodnota/inc)*10);
                if(i === 0){
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                }else{
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = '#ff0505';
                }
                i++;
            })
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(50, suradniceRegresie(upraveneData, 50));
            ctx.lineTo(850, suradniceRegresie(upraveneData, 850));
            ctx.strokeStyle = '#0040ff';
            ctx.stroke();
        }
    }

    //odhlasenie pouzivatela
    function click(){
        props.logout();
        sessionStorage.removeItem('id');
    }
    if (props.mainOpen){
        if (openAdd){
            return (
                <div>
                    <h1>MAIN PAGE id: {props.id}</h1>
                    <div id="merania-metody-container">
                        <div id="vlozit-meranie-container">
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
                        </div>
                        <br></br>
                        <div id="vlozit-metodu-container">
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
                        </div>
                    </div>
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
                        <canvas id="myChart1" width={850} height={450}></canvas>
                    </div>
                    <h3>Graf tep</h3>
                    <div>
                        <canvas id="myChart2" width={850} height={450}></canvas>
                    </div>
                    <h3>Graf kroky</h3>
                    <div>
                        <canvas id="myChart3" width={850} height={450}></canvas>
                    </div>
                    <button onClick={click}>LOGOUT</button>
                </div>
            );
        }else{
            return (
                <div>
                    <h1>MAIN PAGE id: {props.id}</h1>
                    <button onClick={click1}>Vlozit meranie</button>
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
                        <canvas id="myChart1" width={850} height={450}></canvas>
                    </div>
                    <h3>Graf tep</h3>
                    <div>
                        <canvas id="myChart2" width={850} height={450}></canvas>
                    </div>
                    <h3>Graf kroky</h3>
                    <div>
                        <canvas id="myChart3" width={850} height={450} ></canvas>
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