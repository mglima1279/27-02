import { 
    app, 
    getFirestore, 
    setDoc, 
    doc, 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    getDoc 
} from "./firebase/config.js"
const db = getFirestore()
const auth = getAuth();

const form = document.querySelector("form")
const cepInput = document.getElementById("cep")
const addresssItems = document.querySelectorAll(".hiddenItem")
const addressInput = document.querySelectorAll(".addressInput")
const formTitle = document.getElementById("formTitle")
const submitBtn = document.querySelector("input[type='submit']")
const toggleModeBtn = document.getElementById("toggleModeBtn")
const togglePasswordBtn = document.getElementById("togglePasswordBtn")
const passwordInput = document.getElementById("password")

let formExpanded = false
let isLoginMode = false

toggleModeBtn.addEventListener("click", () => {
    isLoginMode = !isLoginMode
    const registerOnlyItems = document.querySelectorAll(".registerOnly")

    if (isLoginMode) {
        registerOnlyItems.forEach(el => {
            el.style.display = "none"
            const input = el.querySelector("input")
            if (input) input.required = false
        })
        collapseForm()
        formTitle.textContent = "LOGIN"
        submitBtn.value = "Entrar"
        toggleModeBtn.textContent = "Não tem uma conta? Cadastre-se"
    } else {
        registerOnlyItems.forEach(el => {
            if (el.classList.contains("formItem")) {
                el.style.display = "flex"
            } else {
                el.style.display = "block"
            }
            const input = el.querySelector("input")
            if (input && input.id !== "notif") input.required = true
        })
        formTitle.textContent = "CADASTRO"
        submitBtn.value = "Cadastrar"
        toggleModeBtn.textContent = "Já tem uma conta? Faça Login"
    }
})

togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)
    togglePasswordBtn.textContent = type === "password" ? "Mostrar" : "Ocultar"
})

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

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    submitBtn.disabled = true

    const data = new FormData(e.target)

    if (isLoginMode) {
        const loginInfo = {
            email: data.get('email'),
            password: data.get('password')
        }

        try {
            const userCred = await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
            
            const docRef = doc(db, `users/${userCred.user.uid}`)
            try{
                const docRead = await getDoc(docRef)

                if(docRead.exists()){
                    const dataRead = docRead.data()
                    checkUser()
                    localSaveUser(dataRead)
                } else {
                    alert("Usuário não encontrado")
                }
            }
            catch(err){
                console.error("Erro ao buscar documento: ", err)
            }
        }
        catch (err) {
            console.error("Erro no login:", err)
            alert("Não foi possível fazer o login")
        }

        submitBtn.disabled = false
        return
    }

    const info = {
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
    }

    if (!validarCPF(info.cpf)) {
        alert("CPF INVÁLIDO")
        submitBtn.disabled = false
        return
    } else if (isNaN(info.address.cep) || info.address.cep.length < 8) {
        alert("CEP INVÁLIDO")
        submitBtn.disabled = false
        return
    } else if (isNaN(info.tel) || info.tel.length < 11) {
        alert("TELEFONE INVÁLIDO")
        submitBtn.disabled = false
        return
    }

    try {
        const userCred = await createUserWithEmailAndPassword(auth, info.email, info.password)
        
        info.id = userCred.user.uid
        
        const docRef = doc(db, "users", info.id)
        
        await setDoc(docRef, info)
        
        localSaveUser(info)
        checkUser()
    }
    catch (err) {
        console.error("Erro no cadastro:", err)
        
        if (err.code === 'auth/email-already-in-use') {
            alert('Email já cadastrado')
        } else if (err.code === 'auth/weak-password') {
            alert('A senha deve ter pelo menos 6 caracteres')
        } else {
            alert('Não foi possível criar o usuário')
        }
    }
    submitBtn.disabled = false
})

function localSaveUser(info) {
    form.reset()
    alert("Cadastro concluído com sucesso")
    info = JSON.stringify(info)
    localStorage.setItem("user", info)
}

function validarCPF(cpf) {
    if (isNaN(cpf)) {
        return false
    }
    cpf = String(cpf)

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false
    }

    const calcularDigito = (multiplicadorMaximo) => {
        let soma = 0

        for (let i = 0; i < multiplicadorMaximo - 1; i++) {
            soma += parseInt(cpf.charAt(i)) * (multiplicadorMaximo - i)
        }

        const resto = (soma * 10) % 11
        return resto === 10 || resto === 11 ? 0 : resto
    }

    if (calcularDigito(10) !== parseInt(cpf.charAt(9))) {
        return false
    }

    if (calcularDigito(11) !== parseInt(cpf.charAt(10))) {
        return false
    }

    return true
}

function checkUser() {
    const tempUserData = localStorage.getItem("user")
    if (tempUserData) {
        const userData = JSON.parse(tempUserData)

        if (confirm(`${userData.nam}, você já está cadastrado!! Deseja sair de sua conta???`)) {
            localStorage.removeItem("user")
        } else {
            window.location.href = "../"
        }
    }
}

checkUser()