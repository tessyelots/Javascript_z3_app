function Reklama(props){

    function click1(){
        window.open(props.reklamaLink1);
        props.close()
        fetch('http://localhost:8000/pocet',{
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
                    id: 1,
                })
            })
    }
    function click2(){
        window.open(props.reklamaLink2);
        props.close()
        fetch('http://localhost:8000/pocet',{
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
                    id: 2,
                })
            })
    }
    function click3(){
        window.open(props.reklamaLink3);
        props.close()
        fetch('http://localhost:8000/pocet',{
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
                    id: 3,
                })
            })
    }

    if (props.reklamaOpen === 0){
        return
    }else if (props.reklamaOpen === 1 && props.mainOpen){
        return (
        <div id="reklama-container">
            <img src={props.reklamaImage1} onClick={click1}/>
        </div>
        )
    }else if (props.reklamaOpen === 2 && props.mainOpen){
        return (
        <div id="reklama-container">
            <img src={props.reklamaImage2} onClick={click2}/>
        </div>
        )
    }else if (props.reklamaOpen === 3 && props.mainOpen){
        return (
        <div id="reklama-container">
            <img src={props.reklamaImage3} onClick={click3}/>
        </div>
        )
    }
}
export default Reklama