export class itemCard{
    constructor(nam, desc, price, und, imgNam, secao, id){
        this.nam = nam || "Indefinido"
        this.desc = desc || ""
        this.price = price || 0
        this.und = und || ""
        this.secao = secao
        this.imgNam = imgNam || "./img/geral/logo.png"
        this.id = id

        const htmlEl = document.createElement("div")
        htmlEl.classList.add("itemCard")
        htmlEl.classList.add(this.secao)

        const img = document.createElement("img")
        img.src = this.imgNam
        htmlEl.appendChild(img)

        const h3 = document.createElement("h3")
        h3.textContent = this.nam
        htmlEl.appendChild(h3)

        const p = document.createElement("p")
        p.textContent = this.desc
        htmlEl.appendChild(p)

        const container = document.createElement("div")

        const curr = document.createElement("span")
        curr.textContent = "R$"
        container.appendChild(curr)

        const val = document.createElement("span")
        val.textContent = this.price.toFixed("2").replaceAll(".", ",")
        container.appendChild(val)

        const unit = document.createElement("span")
        unit.textContent = this.und
        container.appendChild(unit)

        htmlEl.appendChild(container)

        this.button = document.createElement("button")
        this.button.textContent = "Adicionar"
        htmlEl.appendChild(this.button)

        this.htmlEl = htmlEl
    }
}