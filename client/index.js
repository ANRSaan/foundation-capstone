const createUserBtn = document.getElementById('createUserButton')
const deleteUserBtn = document.getElementById('deleteUserButton')





const cardDisplayer = data => {
    let deckTr = document.getElementById('cardHolder')

    while (deckTr.firstChild){
        deckTr.removeChild(deckTr.firstChild)
    }

    for (let i in data) {
        let nameTd = document.createElement('td')
        let nameA = document.createElement('a')
        let typeTd = document.createElement('td')
        let typeA = document.createElement('a')
        let costTd = document.createElement('td')
        let costA = document.createElement('a')
        let factionTd = document.createElement('td')
        let factionA = document.createElement('A')
        // let spacer = document.createElement('br')
        // let spacer2 = document.createElement('br')


        nameA.setAttribute('class', 'cardName')
        typeA.setAttribute('class', 'cardType')
        costA.setAttribute('class', 'cardCost')

        nameA.textContent = `${data[i].name}`
        typeA.textContent = `${data[i].type}`
        costA.textContent = `${data[i].cost}`
        factionA.textContent = `${data[i].faction}`

        deckTr.appendChild(nameTd)
        nameTd.appendChild(nameA)
        deckTr.appendChild(typeTd)
        typeTd.appendChild(typeA)
        deckTr.appendChild(costTd)
        costTd.appendChild(costA)
        deckTr.appendChild(factionTd)
        factionTd.appendChild(factionA)
        // deckTr.appendChild(spacer)
        // deckTr.appendChild(spacer2)


    }
}



// Creates a user based on the information passed in from userHandler
const createUser = (userName) => {
    axios.post('http://localhost:5050/api/users', userName)
        .then(res => alert(`User ${userName.userName} Created`))
        .catch((err) => console.log(err) /*alert(`User already exists`)*/)
}

const deleteUser = (userName) => {
    axios.delete(`http://localhost:5050/api/users/${userName}`)
        .then(res => alert(`User ${userName} Deleted`))
        .catch(err => console.log(err))
}

const cardGetter = () => {
    axios.get('http://localhost:5050/api/cards')
        .then((res) =>
            cardDisplayer(res.data)
        )
        .catch(err => console.log(err))
}

// NEED deckMaker 
// const createDeck = (body) => {
//     axios.post(`http://localhost:5050/api/decklist`, body)
//         .then(() => {
//             deckMaker(res.data)
//         })
// }

// Sets up user to send to createUser
const userHandler = (e) => {
    e.preventDefault()

    let user = document.getElementById('userName')

    if (user.value === '') {
        alert('Please enter a username before submitting')
    }

    let userName = {
        userName: user.value
    }
    

    createUser(userName)

    user.value = ''
}

const userDeleter = (e) => {
    e.preventDefault()

    let user = document.getElementById('userName')

    if (user.value === '') {
        alert('Please enter a username before submitting')
    }

    let newName = user.value

    deleteUser(newName)

    user.value = ''
}

const deckGetter = (event) => {
    event.preventDefault()

    bodyObj = {}

    createDeck(bodyObj)
}


cardGetter()
createUserBtn.addEventListener('click', userHandler)
deleteUserBtn.addEventListener('click', userDeleter)