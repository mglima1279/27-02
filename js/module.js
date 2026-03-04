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

export class cartItem {
    constructor(imgNam, nam, price, und, qtd, id, onUpdate, onRemove) {
        this.imgNam = imgNam || "./img/geral/logo.png";
        this.nam = nam || "Indefinido";
        this.price = price || 0;
        this.und = und || "und";
        this.qtd = qtd || 1;
        this.id = id;

        const htmlEl = document.createElement("div");
        htmlEl.classList.add("itemDiv");

        const img = document.createElement("img");
        img.src = `../${this.imgNam}`;
        img.alt = this.nam;
        htmlEl.appendChild(img);

        const infoContainer = document.createElement("div");

        const nomeDiv = document.createElement("div");
        nomeDiv.classList.add("itemNome");
        nomeDiv.textContent = this.nam;
        infoContainer.appendChild(nomeDiv);

        const precosDiv = document.createElement("div");
        precosDiv.classList.add("itemPrecos");

        const priceSpan = document.createElement("span");
        priceSpan.textContent = this.price.toFixed(2).replace(".", ",");

        const undSpan = document.createElement("span");
        undSpan.textContent = this.und;

        this.inputQtd = document.createElement("input");
        this.inputQtd.type = "number";
        this.inputQtd.value = this.qtd;
        this.inputQtd.min = "0";

        this.totalSpan = document.createElement("span");
        const totalValue = this.price * this.qtd;
        this.totalSpan.textContent = totalValue.toFixed(2).replace(".", ",");

        precosDiv.append(
            "R$ ", priceSpan, " ", undSpan, " ", 
            this.inputQtd, 
            " R$ ", this.totalSpan
        );

        infoContainer.appendChild(precosDiv);
        htmlEl.appendChild(infoContainer);

        this.deleteBtn = document.createElement("i");
        this.deleteBtn.className = "fa-regular fa-circle-xmark deletar";
        htmlEl.appendChild(this.deleteBtn);

        this.htmlEl = htmlEl;

        this.inputQtd.addEventListener("change", () => {
            const newQtd = parseInt(this.inputQtd.value);
            if (newQtd <= 0) {
                if (onRemove) onRemove();
            } else {
                this.qtd = newQtd;
                const newTotal = this.price * this.qtd;
                this.totalSpan.textContent = newTotal.toFixed(2).replace(".", ",");
                if (onUpdate) onUpdate(this.qtd);
            }
        });

        this.deleteBtn.addEventListener("click", () => {
            if (onRemove) onRemove();
        });
    }
}
