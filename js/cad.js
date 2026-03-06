import { app, getFirestore, setDoc, doc } from "./firebase/config.js"

const db = getFirestore()

const form = document.querySelector("form")
const cepInput = document.getElementById("cep")
const addresssItems = document.querySelectorAll(".hiddenItem")
const addressInput = document.querySelectorAll(".addressInput")
let formExpanded = false

cepInput.addEventListener("input", () => {
    const val = cepInput.value

    if (val.length == 8 && !isNaN(val)) {
        expandForm(val)
    } else if (val.length < 8 && formExpanded) {
        collapseForm()
    }
})

function expandForm(cep) {
    fetch(wrapUrl(cep))
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert("CEP não encontrado.")
            collapseForm()
            return
        }

        addressInput[0].value = data.logradouro

        addresssItems.forEach(el => {
            el.classList.remove("hiddenItem")
        })
        formExpanded = true
    })
    .catch(err => {
        console.error("Erro na busca:", err)
        collapseForm()
    })

    function wrapUrl(cep) {
        return `https://viacep.com.br/ws/${cep}/json/`
    }
}

function collapseForm() {
    let n = 0
    addresssItems.forEach(el => {
        el.classList.add("hiddenItem")
        addressInput[n].value = ""
        n++
    })
    formExpanded = false
}

form.addEventListener("submit", (e)=>{
    e.preventDefault()

    const data = new FormData(e.target)

    
    const info = {
        id: Date.now(),
        nam: data.get('nam'),
        lastNam: data.get('secNam'),
        cpf: data.get('cpf'),
        tel: data.get('tel'),
        email: data.get('email'),
        birth: data.get('birth'),
        address: {
            cep: data.get('cep'),
            logr: addressInput[0].value, 
            comp: data.get('comp') || "",
            n: data.get('num') || ""
        },
        password: data.get('password'),
        notif: data.get('notif') == 'on' 
    };

    if(!validarCPF(info.cpf)){
        alert("CPF INVÁLIDO")
        return
    } else if(isNaN(info.address.cep) || info.address.cep.length<8){
        alert("CEP INVÁLIDO")
        return
    } else if(isNaN(info.tel) || info.tel.length<11){
        alert("TELEFONE INVÁLIDO")
        return
    }

    const interv = setInterval(()=>{
        const docRef = doc(db, `users/${info.id}`)
        
        setDoc(docRef, info)
        .then(()=>{
            localSaveUser(info)
            form.reset()
            alert("Cadastro concluido com sucesso")
            clearInterval(interv)
        })
        .catch((err)=>{
            console.error("Error writing doc: ", err)
            clearInterval(interv)
        })
    }, 1000) 
})

function localSaveUser(info){
    info = JSON.stringify(info)
    
    localStorage.setItem("user", info)
}

function validarCPF(cpf) {
    if(isNaN(cpf)) { 
        return false
    }
    cpf = String(cpf);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    const calcularDigito = (multiplicadorMaximo) => {
        let soma = 0;
        
        for (let i = 0; i < multiplicadorMaximo - 1; i++) {
            soma += parseInt(cpf.charAt(i)) * (multiplicadorMaximo - i);
        }
        
        const resto = (soma * 10) % 11;
        return resto === 10 || resto === 11 ? 0 : resto;
    };

    if (calcularDigito(10) !== parseInt(cpf.charAt(9))) {
        return false;
    }

    if (calcularDigito(11) !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

function checkUser(){
    const tempUserData = localStorage.getItem("user")
    if (tempUserData) {
        const userData = JSON.parse(tempUserData)

        if(confirm(`${userData.nam}, você já está cadastrado!! Deseja sair e criar outro usuáio?`)){
            localStorage.removeItem("user")
        } else{
            window.location.href = "../"
        }
    }
}

checkUser()

