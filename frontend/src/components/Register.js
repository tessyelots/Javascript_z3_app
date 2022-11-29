function Register (props) {
    function click() {
        props.openReg()
    }

    function getInput(id) {
        return document.getElementById(id).value
    }

    function goMain() {
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
                    props.openMain(data.id);
                }
        });
    }

    if (props.registerOpen){
        return (
            <div>
                <h1>REGISTER</h1>
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
                <button onClick={click}>Login</button>
                <button onClick={goMain}>Register</button>
            </div>
        );
    }else{
        return 
    }
    }
    

export default Register