const express = require("express");
const cors = require("cors");
const { axios } = require("axios");
const TAMAGOTCHI = require("./{} db.json");
let globalId = 4

const PORT = 4004;

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static('../public'))

app.set('view engine', 'ejs')

app.get(`/game/:id`, (req, res) => {
    let index = findTamagotchiById(+req.params.id)
    if (index === null) {
        res.status(404).send("Tamagotchi doesn't exist");
    }
    res.render(`game.ejs`, { tamagotchi: index })
})

app.post(`/game/:id/feed`, (req, res) => {
    let tami = findTamagotchiById(+req.params.id)
    if (tami === null) {
        res.status(404).send("Tamagotchi doesn't exist");
    }
    feedbtn(tami)
    res.status(200).send(tami)
})

app.post(`/game/:id/play`, (req, res) => {
    let tami = findTamagotchiById(+req.params.id)
    if (tami === null) {
        res.status(404).send("Tamagotchi doesn't exist");
    }
    playBtn(tami)
    res.status(200).send(tami)
})

app.post(`/game/:id/clean`, (req, res) => {
    let tami = findTamagotchiById(+req.params.id)
    if (tami === null) {
        res.status(404).send("Tamagotchi doesn't exist");
    }
    cleanBtn(tami)
    res.status(200).send(tami)
})

app.get(`/api/tamagotchi`, (req, res) => {
    res.status(200).send(TAMAGOTCHI)
})

app.get(`/api/tamagotchi/:id`, (req, res) => {
    let oneTamagotchi = findTamagotchiById(+req.params.id)
    if (oneTamagotchi === null) {
        res.status(404).send("Tamagotchi doesn't exist");
    }
    res.status(200).send(oneTamagotchi)
})

const findTamagotchiById = (id) => {
    let index = TAMAGOTCHI.findIndex(elem => elem.id === +id)
    if (index === -1) {
        return null
    }

    return TAMAGOTCHI[index]
}

app.post(`/api/tamagotchi`, (req, res) => {
    let { name } = req.body
    if (TAMAGOTCHI.some(e => e.name === name)) {
        res.status(400).end()
    } else {
        const newTamagotchi = {
            id: globalId,
            isDead: false,
            name,
            health: 9,
            hunger: 4,
            energy: 4,
            hygiene: 4
        }
        TAMAGOTCHI.push(newTamagotchi)
        globalId++
        res.status(200).send(newTamagotchi)
    }
})

app.put(`/api/tamagotchi/:id`, (req, res) => {
    const tamagotchi = req.body;
    let index = TAMAGOTCHI.findIndex(elem => elem.id === +req.params.id)
    if (index === -1) {
        res.status(404).send("Tamagotchi doesn't exist");
    }
    if (tamagotchi.id !== +req.params.id) {
        res.status(400).send("Id mismatch");
    }
    if (!tamagotchi.name || !tamagotchi.health || !tamagotchi.hunger || !tamagotchi.energy || !tamagotchi.hygiene) {
        res.status(400).send("Incomplete data");
    }
    TAMAGOTCHI.splice(index, 1);
    TAMAGOTCHI.push(tamagotchi);
    res.status(200).send(tamagotchi)
})

app.delete(`/api/tamagotchi/:id`, (req, res) => {
    let index = TAMAGOTCHI.findIndex(elem => elem.id === +req.params.id)
    TAMAGOTCHI.splice(index, 1)
    res.status(200).send(TAMAGOTCHI)
})

function feedbtn(tami) {
    if (!tami.isDead) {
        tami.hunger++
        tami.hygiene--

        if (tami.hunger < 5) {
            tami.health++
        }
        healthStat(tami)
        isDead(tami)
    }
}

function playBtn(tami) {
    if (!tami.isDead) {
        tami.energy++
        tami.hunger--

        if (tami.energy < 5) {
            tami.health++
        }

        healthStat(tami)
        isDead(tami)
    }
}

function cleanBtn(tami) {
    if (!tami.isDead) {
        tami.hygiene++
        tami.energy--

        if (tami.hygiene < 5) {
            tami.health++
        }

        healthStat(tami)
        isDead(tami)
    }
}

function isDead(tami) {
    if (tami.health <= 0) {
        tami.isDead = true;
    }
    return tami.isDead
}

function healthStat(tami) {
    if (tami.health >= 10) {
        tami.health = 10

    }

    if (tami.hunger > 5) {
        tami.hunger = 5
        tami.health--
    }

    if (tami.hunger <= 0) {
        tami.hunger = 0
        tami.health--
    }

    if (tami.energy > 5) {
        tami.energy = 5
        tami.health--
    }

    if (tami.energy <= 0) {
        tami.energy = 0
        tami.health--
    }

    if (tami.hygiene > 5) {
        tami.hygiene = 5
        tami.health--
    }
    if (tami.hygiene <= 0) {
        tami.hygiene = 0
        tami.health--
    }
}


app.listen(PORT, () => {
    console.log(`we are live....${PORT}`);
});