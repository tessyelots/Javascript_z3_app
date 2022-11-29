import './App.css';
import Login from './components/Login';
import Register from './components/Register'; 
import Main from './components/Main';
import Admin from './components/Admin';
import Reklama from './components/Reklama';
import { useState, useEffect } from 'react';

function App() {

  useEffect(() => {
    var i = 1;
    loadReklama()
    const interval = setInterval(() => {
      if (i > 3) i = 1;
      setReklamaOpen(i);
      i++;
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval1 = setInterval(() => {
      loadReklama();
    }, 5000);
    return () => clearInterval(interval1);
  }, []);

  const [loginOpen, setLoginOpen] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mainOpen, setMainOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false)
  const [reklamaOpen, setReklamaOpen] = useState(0)
  const [reklamaImage1, setReklamaImage1] = useState('')
  const [reklamaLink1, setReklamaLink1] = useState('')
  const [reklamaImage2, setReklamaImage2] = useState('')
  const [reklamaLink2, setReklamaLink2] = useState('')
  const [reklamaImage3, setReklamaImage3] = useState('')
  const [reklamaLink3, setReklamaLink3] = useState('')
  const [pocet1, setPocet1] = useState(0);
  const [pocet2, setPocet2] = useState(0);
  const [pocet3, setPocet3] = useState(0);

  const [activeUserId, setActiveUserId] = useState(0);

  function loadReklama(){
    fetch('http://localhost:8000/reklama',{
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
            setReklamaImage1(data.list[0].obrazok)
            setReklamaLink1(data.list[0].link)
            setReklamaImage2(data.list[1].obrazok)
            setReklamaLink2(data.list[1].link)
            setReklamaImage3(data.list[2].obrazok)
            setReklamaLink3(data.list[2].link)
            setPocet1(parseInt(data.list[0].pocet))
            setPocet2(parseInt(data.list[1].pocet))
            setPocet3(parseInt(data.list[2].pocet))
        })
  }

  function zatvorReklama(){
    setReklamaOpen(0)
    loadReklama();
  }

  function zatvorRegister() {
    setRegisterOpen(false);
    setLoginOpen(true);
  }

  function zatvorLogin() {
    setLoginOpen(false);
    setRegisterOpen(true);
  }

  function otvorMain(id) {
    setLoginOpen(false)
    setRegisterOpen(false)
    setActiveUserId(id)
    setMainOpen(true)
  }

  function logout(){
    setMainOpen(false)
    setLoginOpen(true)
  }

  function otvorAdmin(){
    if (adminOpen) {
      setAdminOpen(false)
      setLoginOpen(true)
    }else{
      setAdminOpen(true)
      setLoginOpen(false)
    }
    
  }

  return (
    <div className="App">
        <Login
          loginOpen={loginOpen}
          openLog={zatvorLogin}
          openMain={otvorMain}
          openAdmin={otvorAdmin}
        />
        <Register
          registerOpen={registerOpen}
          openReg={zatvorRegister}
          openMain={otvorMain}
        />
        <Reklama
        reklamaOpen={reklamaOpen}
        mainOpen={mainOpen}
        reklamaImage1={reklamaImage1}
        reklamaLink1={reklamaLink1}
        reklamaImage2={reklamaImage2}
        reklamaLink2={reklamaLink2}
        reklamaImage3={reklamaImage3}
        reklamaLink3={reklamaLink3}
        close={zatvorReklama}
        />
        <Main
          mainOpen={mainOpen}
          id={activeUserId}
          logout={logout}
        />
        <Admin
          adminOpen={adminOpen}
          reklamaImage1={reklamaImage1}
          reklamaLink1={reklamaLink1}
          reklamaImage2={reklamaImage2}
          reklamaLink2={reklamaLink2}
          reklamaImage3={reklamaImage3}
          reklamaLink3={reklamaLink3}
          pocet1={pocet1}
          pocet2={pocet2}
          pocet3={pocet3}
          updateImages={loadReklama}
          logout={otvorAdmin}
        />
    </div>
  );
}

export default App;
