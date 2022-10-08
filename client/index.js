// const createUserBtn = document.getElementById('createUserButton')
// const deleteUserBtn = document.getElementById('deleteUserButton')
const nameDeckBtn = document.getElementById('createDeckButton')
const deleteDeckBtn = document.getElementById('deleteDeckButton')
const cardAddButton = document.getElementById('cardDiv')
const deckAddButton = document.getElementById('deckDiv')
const allCardsBtn = document.getElementById('all')
const eventCardsBtn = document.getElementById('event')
const hardwareCardsBtn = document.getElementById('hardware')
const programCardsBtn = document.getElementById('program')
const resourceCardsBtn = document.getElementById('resource')


const cardDisplayer = data => {
    let deckTbody = document.getElementById('cardHolder')
    
    while (deckTbody.firstChild){
        deckTbody.removeChild(deckTbody.firstChild)
    }

    for (let i in data) {
        let cardName = data[i].name

        let deckTr = document.createElement('tr')
        let numberTd = document.createElement('td')
        let numberLabel0 = document.createElement('label')
        let numberLabel1 = document.createElement('label')
        let numberLabel2 = document.createElement('label')
        let numberLabel3 = document.createElement('label')
        let numberInput0 = document.createElement('input')
        let numberInput1 = document.createElement('input')
        let numberInput2 = document.createElement('input')
        let numberInput3 = document.createElement('input')
        let nameTd = document.createElement('td')
        let nameA = document.createElement('a')
        let typeTd = document.createElement('td')
        let typeA = document.createElement('a')
        let costTd = document.createElement('td')
        let costA = document.createElement('a')
        let factionTd = document.createElement('td')
        let factionA = document.createElement('a')

        nameA.setAttribute('class', 'cardName')
        typeA.setAttribute('class', 'cardType')
        costA.setAttribute('class', 'cardCost')
        
        numberInput0.setAttribute('type', 'button')
        numberInput1.setAttribute('type', 'button')
        numberInput2.setAttribute('type', 'button')
        numberInput3.setAttribute('type', 'button')
        numberLabel0.setAttribute('textContent', '0')
        numberLabel1.setAttribute('textContent', '1')
        numberLabel2.setAttribute('textContent', '2')
        numberLabel3.setAttribute('textContent', '3')
        numberInput0.setAttribute('value', '0')
        numberInput1.setAttribute('value', '1')
        numberInput2.setAttribute('value', '2')
        numberInput3.setAttribute('value', '3')
        numberInput0.setAttribute('id', `${cardName}`)
        numberInput1.setAttribute('id', `${cardName}`)
        numberInput2.setAttribute('id', `${cardName}`)
        numberInput3.setAttribute('id', `${cardName}`)

        nameA.textContent = `${data[i].name}`
        typeA.textContent = `${data[i].type}`
        costA.textContent = `${data[i].cost}`
        factionA.textContent = `${data[i].faction}`

        deckTbody.appendChild(deckTr)
        deckTr.appendChild(numberTd)
        numberTd.appendChild(numberLabel0)
        numberLabel0.appendChild(numberInput0)
        numberTd.appendChild(numberLabel1)
        numberLabel1.appendChild(numberInput1)
        numberTd.appendChild(numberLabel2)
        numberLabel2.appendChild(numberInput2)
        numberTd.appendChild(numberLabel3)
        numberLabel3.appendChild(numberInput3)
        deckTr.appendChild(nameTd)
        nameTd.appendChild(nameA)
        deckTr.appendChild(typeTd)
        typeTd.appendChild(typeA)
        deckTr.appendChild(costTd)
        costTd.appendChild(costA)
        deckTr.appendChild(factionTd)
        factionTd.appendChild(factionA)
    }
}

const deckDisplayer = data => {
    let deckTbody = document.getElementById('deckHolder')
    
    while (deckTbody.firstChild){
        deckTbody.removeChild(deckTbody.firstChild)
    }

    for (let i in data) {
        let deckTr = document.createElement('tr')
        let numberTd = document.createElement('td')
        let numberA = document.createElement('a')
        let nameTd = document.createElement('td')
        let nameA = document.createElement('a')
        let typeTd = document.createElement('td')
        let typeA = document.createElement('a')
        let costTd = document.createElement('td')
        let costA = document.createElement('a')
        let factionTd = document.createElement('td')
        let factionA = document.createElement('a')

        // deckTr.setAttribute('class', `${cardName}`)
        nameA.setAttribute('class', 'cardName')
        typeA.setAttribute('class', 'cardType')
        costA.setAttribute('class', 'cardCost')

        numberA.textContent = `${data[i].number}`
        nameA.textContent = `${data[i].name}`
        typeA.textContent = `${data[i].type}`
        costA.textContent = `${data[i].cost}`
        factionA.textContent = `${data[i].faction}`

        deckTbody.appendChild(deckTr)
        deckTr.appendChild(numberTd)
        numberTd.appendChild(numberA)
        deckTr.appendChild(nameTd)
        nameTd.appendChild(nameA)
        deckTr.appendChild(typeTd)
        typeTd.appendChild(typeA)
        deckTr.appendChild(costTd)
        costTd.appendChild(costA)
        deckTr.appendChild(factionTd)
        factionTd.appendChild(factionA)
    }
}

const showDecks = (data) => {
    let selectDiv = document.getElementById('selectDiv')

    let select = document.createElement('select')

    for (i in data){
        let option = document.createElement('option')
        let button = document.createElement('button')

        option.textContent = `${data[i].name}`
    }
}

// Creates a user based on the information passed in from userHandler
const createUser = (userName) => {
    axios.post('http://localhost:5050/api/users', userName)        
        .then(res => {
            currentName = document.getElementById('currentName')
            currentName.innerHTML= `${userName.userName}`
        })
        .catch((err) => console.log(err) /*alert(`User already exists`)*/)
}

const deleteUser = (userName) => {
    axios.delete(`http://localhost:5050/api/users/${userName}`)
        .then(res => alert(`User ${userName} Deleted`))
        .catch(err => console.log(err))
}

const cardGetter = () => {
    axios.get('http://localhost:5050/api/cards')
        .then(res => cardDisplayer(res.data))
        .catch(err => console.log(err))
}
const eventGetter = () => {
    axios.get('http://localhost:5050/api/cards/events')
        .then(res => cardDisplayer(res.data))
        .catch(err => console.log(err))
}

const hardwareGetter = () => {
    axios.get('http://localhost:5050/api/cards/hardware')
        .then(res => cardDisplayer(res.data))
        .catch(err => console.log(err))
}

const programGetter = () => {
    axios.get('http://localhost:5050/api/cards/programs')
        .then(res => cardDisplayer(res.data))
        .catch(err => console.log(err))
}

const resourceGetter = () => {
    axios.get('http://localhost:5050/api/cards/resources')
        .then(res => cardDisplayer(res.data))
        .catch(err => console.log(err))
}


const deckNamer = (deckName) => {
    let deck = deckName.deckName
    let currentDeck = document.getElementById('deckName')
    currentDeck.innerHTML= `${deck}`

    console.log(deck)
    console.log(currentDeck)

    axios.post('http://localhost:5050/api/decklist', deckName)
        .then(res => {            
            currentDeck.innerHTML= `${deck}`
        })
        .catch(err => {
            console.log(err)               
        })    
}

const deckGetter = () => {
    axios.get('http://localhost:5050/api/decklist')
    .then(res => {
        deckDisplayer(res.data)
    })
    .catch(err => console.log(err))
}

const deckDeleter = (deckName) => {
    axios.delete(`http://localhost:5050/api/decklist/${deckName}`)
        .then(res => {
            deck = document.getElementById('deckName')
            deck.innerHTML = ''
            let deckTbody = document.getElementById('deckHolder')
    
            while (deckTbody.firstChild){
                deckTbody.removeChild(deckTbody.firstChild)
            }
            alert(`${deckName} deleted.`)
        })
        .catch(err => console.log(err))
    }
    
const deckCollecter = () => {
    axios.get('http://localhost:5050/api/decklist/user')
        .then(res => showDecks(res.data))
        .catch(err => console.log(err))
}

const cardAdder = (cardBody) => {
    axios.post('http://localhost:5050/api/decklist/card', cardBody)
        .then(res => deckGetter())
        .catch(err => console.log(err))
}

const cardDeleter = (cardName) => {
    axios.delete(`http://localhost:5050/api/decklists/card/${cardName}`)
        .then(res => deckGetter())
        .catch(err => console.log(err))
}


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
        return
    }

    let newName = user.value

    deleteUser(newName)

    user.value = ''
}

const nameDeck = (e) => {
    e.preventDefault()

    let deck = document.getElementById('deckField')

    if (deck.value === '') {
        alert('Please enter a username before submitting')
        return
    }

    // nameDeckBtn.remove()
    let deckName = {
        deckName: deck.value,
        userName: 'Default'
    }
    deckNamer(deckName)

    deck.value = ''
}

const deleteDeck = e => {
    e.preventDefault()
    
    let deck = document.getElementById('deckField')
    // console.log(deck.value)

    if (deck.value === '') {
        alert('Please confirm the name of the deck to delete')
        return
    }

    let deckName = deck.value

    deckDeleter(deckName)
    deck.value = ''
}

const dbSeeder = () => {
    axios.post(`http://localhost:5050/api/seed`)
}


// const deckGetter = (event) => {
//     event.preventDefault()

//     bodyObj = {}

//     createDeck(bodyObj)
// }

dbSeeder()
cardGetter()
// createUserBtn.addEventListener('click', userHandler)
// deleteUserBtn.addEventListener('click', userDeleter)
nameDeckBtn.addEventListener('click', nameDeck)
deleteDeckBtn.addEventListener('click', deleteDeck)
allCardsBtn.addEventListener('click', cardGetter)
eventCardsBtn.addEventListener('click', eventGetter)
hardwareCardsBtn.addEventListener('click', hardwareGetter)
programCardsBtn.addEventListener('click', programGetter)
resourceCardsBtn.addEventListener('click', resourceGetter)
cardAddButton.addEventListener('click', click => {
    let number = click.target.value
    let currentDeck = document.getElementById('deckName')

    if (currentDeck.textContent === '' && click.target.type === 'button'){
        alert('Please enter a deck name first')
        return
    }

    if (click.target && click.target.type === 'button'){
        let cardName = click.target.id
        
        let deckName = document.getElementById('deckName').innerHTML

        if (number !== '0'){

            let cardBody = {
                cardName: `${cardName}`,
                cardNumber: `${number}`,
                deckName: `${deckName}`
            }

            cardAdder(cardBody)        
        }
        if (number === '0'){

            cardDeleter(cardName)
        }
    }
})