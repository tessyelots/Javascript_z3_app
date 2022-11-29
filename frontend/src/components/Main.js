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
                    date: getInput('datum-input'),
                    value: getInput('hodnota-input'),
                    typ: getRadio('typ'),
                    method: getRadio('metoda'),
                })
            }).then(data => data.json()).then(data => {
                console.log(data.message)
            });
            setOpenAdd(false)
        }else{
            setOpenAdd(true)
            fetch('http://localhost:8000/metoda',{
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
                console.log(data)
                updateMetody(data.list)
            });
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
                    nazov: getInput('nazov-input'),
                    popis: getInput('popis-input'),
                })
            }).then(data => data.json()).then(data => {
                console.log(data)
                updateMetody(data.list)
            });
        }else{
            setOpenAdd(true)
            fetch('http://localhost:8000/metoda',{
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
                    nazov: getInput('zmazat-metodu-input'),
                })
            }).then(data => data.json()).then(data => {
                console.log(data)
                updateMetody(data.list)
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
                    <button onClick={click}>LOGOUT</button>
                </div>
            );
        }else{
            return (
                <div>
                    <h1>MAIN PAGE id: {props.id}</h1>
                    <button onClick={click1}>Vlozit meranie</button>
                    <button onClick={click2}>Vlozit metodu</button>
                    <button onClick={click}>LOGOUT</button>
                </div>
            );
        }
        
    }else{
        return
    }
    
}

export default Main