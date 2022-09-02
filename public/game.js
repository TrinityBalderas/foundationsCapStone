let img = document.getElementById("img")
let health = document.getElementById("health")
let hunger = document.getElementById("hunger")
let energy = document.getElementById("energy")
let hygiene = document.getElementById("hygiene")
const baseURL = "http://localhost:4004";

const updateDom = (tami) => {
    let hearts = ""
    let skulls = ""
    for (let i = 1; i <= tami.health; i++) {
        hearts += "♥"
    }
    for (let i = tami.health; i < 10; i++) {
        skulls += "💀"
    }
    health.innerHTML = `
    <span id="hearts">
    ${hearts}
    </span>
    <span id="empty-hearts">
    ${skulls}
    </span>`

    hunger.innerText = `${tami.hunger}/5`
    energy.innerText = `${tami.energy}/5`
    hygiene.innerText = `${tami.hygiene}/5`
}

async function feed(id) {
    res = await fetch(`/game/${id}/feed`, { method: 'POST', body: {} });
    let data = await res.json()
    updateDom(data);
    feedImg(data);
}

async function play(id) {
    res = await fetch(`/game/${id}/play`, { method: 'POST', body: {}, cache: 'no-cache' })
    let data = await res.json()
    updateDom(data);
    playImg(data);
}

async function clean(id) {
    res = await fetch(`/game/${id}/clean`, { method: 'POST', body: {}, cache: 'no-cache' })
    let data = await res.json()
    updateDom(data);
    cleanImg(data);
}
const feedImg = (tami) => {
    if (tami.isDead) {
        img.src = "../img/kill.gif"
    } else {
        img.src = "../img/feed.gif"
    }
}

const playImg = (tami) => {
    if (tami.isDead) {
        img.src = "../img/kill.gif"
    } else {
        let imgArray = ["../img/play.gif", "../img/play2.gif"]
        let randomImg = imgArray[Math.floor(Math.random() * imgArray.length)]
        img.src = randomImg;
    }
}

const cleanImg = (tami) => {
    if (tami.isDead) {
        img.src = "../img/kill.gif"
    } else {
        let imgArray = ["../img/clean.gif", "../img/clean2.gif"]
        let randomImg = imgArray[Math.floor(Math.random() * imgArray.length)]
        img.src = randomImg;
    }
}
