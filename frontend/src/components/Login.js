function Login (props) {
    function goRegister() {
        props.openLog()
    }

    function getInput(id){
        return document.getElementById(id).value
    }

    function goMain() {
        fetch('http://localhost:8000/user',{
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
                    password: getInput('password-input')
                })
            }).then(data => data.json()).then(data => {
                if (data.err === 'zly email') {
                    alert("Email neexistuje napis novy")
                }else if(data.err === 'zle heslo'){
                    alert("nespravne heslo")
                }else if(data.err === 'admin'){
                    props.openAdmin()
                }else{
                    props.openMain(data.id)
                }
        });
    }

    if (props.loginOpen){
        return (
            <div>
                <h1>LOGIN</h1>
                Email:
                <br></br>
                <input id="email-input"></input>
                <br></br>
                Heslo:
                <br></br>
                <input type="password" id="password-input"></input>
                <br></br>
                <button onClick={goMain}>Login</button>
                <button onClick={goRegister}>Register</button>
            </div>
        );
    }else{
        return 
    }
}

export default Login