function generateCards(){
    let data = []

    fetch(encodeURI(url))
    .then(res=> res.json())
    .then(info=>{
        info.forEach(el => {
            data.push(el)
        });
    })

    return data
}

generateCards()
