const createUserBtn = document.getElementById('createUserButton')
const deleteUserBtn = document.getElementById('deleteUserButton')



// Creates a user based on the information passed in from userHandler
const createUser = (userName) => {
    axios.post('/api/users')
        .then(res => alert(`User ${userName} Created`))
        .catch((err) => console.log(err) /*alert(`User already exists`)*/)
}

const deleteUser = (userName) => {
    axios.delete(`/api/users:${userName}`)
        .then(res => alert(`User ${userName} Deleted`))
        .catch(err => console.log(err))
}

// Sets up user to send to createUser
const userHandler = (e) => {
    e.preventDefault()

    let user = document.getElementById('userName')

    if (user.value === '') {
        alert('Please enter a username before submitting')
    }

    let newName = {
        userName: user.value
    }

    createUser(newName)

    user.value = ''
}

const userDeleter = (e) => {
    e.preventDefault()

    let user = document.getElementById('userName')

    if (user.value === '') {
        alert('Please enter a username before submitting')
    }

    let newName = {
        userName: user.value
    }

    deleteUser(newName)

    user.value = ''
}

createUserBtn.addEventListener('click', userHandler)
deleteUserBtn.addEventListener('click', userDeleter)