import { itemCard } from "./module.js"

const itemContainer = document.getElementById("itemContainer")
const categDiv = document.getElementById("categ")

let selectedCateg = document.querySelector(".selected")
selectedCateg.addEventListener("click", function(){
    sectionClick(this)
})

const itemCards = []

const cartListIds = [], cartListQtd = []

const searchInput = document.getElementById("searchInput");
const searchBtn = document.querySelector(".search button");

function sectionClick(btn){
    changeSelectStyle(btn)

    hiddenItems()

    const secao = btn.id
    if(secao == "Todos"){
        itemCards.forEach(el=>{
            el.style.display = "flex"
        })
    } else{
        const secItems = itemCards.filter(el=>el.classList.contains(secao))
        secItems.forEach(el=>{
            el.style.display = "flex"
        })
    }
}

function hiddenItems(){
    itemCards.forEach(el=>{
        el.style.display = "none"
    })
}

function changeSelectStyle(btn){
    selectedCateg.classList.toggle("selected")
    selectedCateg = btn
    selectedCateg.classList.toggle("selected")
}

function generateCategs(){
    let categs = []

    fetch(encodeURI("./js/db.json"))
    .then(res=> res.json())
    .then(info=>{
        info.forEach(el => {
            const secName = el.setor.secao.nomeSecao
            if(!categs.includes(secName)){
                const htmlEl = document.createElement("button")
                htmlEl.id = secName
                htmlEl.textContent = secName

                htmlEl.addEventListener("click", function(){
                    sectionClick(this)
                })

                categDiv.appendChild(htmlEl)

                categs.push(secName)
            }
        });
    })
}


function generateCards(){
    let data = []

    fetch(encodeURI("./js/db.json"))
    .then(res=> res.json())
    .then(info=>{
        info.forEach(el => {
            const newCard = new itemCard(el.descricao, el.descricaoDetalhada, el.valorUnitario, el.unidade, el.caminhoImagem, el.setor.secao.nomeSecao, el.idProduto)
            configCardButton(newCard)
            itemContainer.appendChild(newCard.htmlEl)
            itemCards.push(newCard.htmlEl)
        });
    })
}

function configCardButton(card){
    card.button.addEventListener("click" ,function(){
        if(cartListIds.includes(card.id)){
            cartListQtd[cartListIds.indexOf(card.id)]++
        } else {
            cartListIds.push(card.id)
            cartListQtd.push(1)
        }
        localStorage.setItem("cartIds", JSON.stringify(cartListIds))
        localStorage.setItem("cartQtds", JSON.stringify(cartListQtd))
    })
}

function loadLocalStorage(){
    cartListIds.push(...JSON.parse(localStorage.getItem("cartIds")))
    cartListQtd.push(...JSON.parse(localStorage.getItem("cartQtds")))
}

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const btnTodos = document.getElementById("Todos");
    if (selectedCateg !== btnTodos) {
        sectionClick(btnTodos);
    }

    itemCards.forEach(card => {
        const productName = card.querySelector("h3").textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

searchInput.addEventListener("input", searchProducts);

searchBtn.addEventListener("click", searchProducts);

generateCards()
generateCategs()
loadLocalStorage()
