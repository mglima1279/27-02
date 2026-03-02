function generateCards(){
    const data = fetchData("./js/db.json")
    console.log(data)
}

function fetchData(url){
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
