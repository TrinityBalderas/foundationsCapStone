const errMsg = document.getElementById("errMesg");
const form = document.querySelector("form");
const list = document.getElementById("ol-list");
const deleteBtn = document.getElementsByTagName("button");
const baseURL = "http://localhost:4004";

const getList = () => {
  axios.get(`${baseURL}/api/tamagotchi`)
    .then(({ data }) => {
      let tamagotchis = data
      list.innerHTML = ''
      tamagotchis.forEach(e => {
        let listHtml = makeItem(e)
        list.innerHTML += listHtml
      })
    })
}

const submitHandler = (e) => {
  e.preventDefault()
  const userInput = document.querySelector("#userInput");
  let body = {
    name: userInput.value
  }
  createTamagotchi(body)
}

const createTamagotchi = (body) => {
  axios.post(`${baseURL}/api/tamagotchi`, body)
    .then(({ data }) => {
      let tamagotchi = data
      list.innerHTML += makeItem(tamagotchi)

    })
    .catch(displayError)
}

const displayError = (err) => {
  errMsg.innerHTML = `Name cannot be the same`
}

const deleteTamagotchi = (e, id) => {
  axios.delete(`${baseURL}/api/tamagotchi/${id}`)
  e.parentElement.remove();
}

const makeItem = (tamagotchi) => {
  return `<li><a href="${baseURL}/game/${tamagotchi.id}">${tamagotchi.name}</a>
      <button onclick="deleteTamagotchi(this,${tamagotchi.id})" >Delete</button>
  </li>
  `
}

form.addEventListener('submit', submitHandler)
getList()