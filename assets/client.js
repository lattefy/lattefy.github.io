const apiUrl = 'https://lattefy-server.glitch.me'
// const apiUrl = 'http://localhost:3336'

// Get all from Table
async function getAll (table) {
    return fetch(apiUrl + `/${table}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching Clients: ', error)
        })
}

// Client Authentication
function authenticateEmail(email, clients) {
    return !clients.some(client => client.EMAIL === email)
}

// Get 5-Star Rating
function getStarRating() {
    let userRating = null 

    document.querySelectorAll('.star').forEach((star, index) => {
        star.addEventListener('click', () => {
            userRating = 5 - index
            console.log('User rating updated:', userRating)
        })
    })
    return () => userRating
}
const getUserRating = getStarRating()

document.getElementById('btn').addEventListener('click', () => {
    const rating = getUserRating()
    if (rating !== null) {
        console.log('User rating on button click:', rating)
    } else {
        console.log('No rating selected')
    }
})

// Create Code
function generateCode(birthdate, name, email) {
    const hash = (input) => {
        let hash = 0
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash |= 0
        }
        return hash
    }

    const letters = 'abcdefghijklmnopqrstuvwxyz'
    const digits = '0123456789'

    const birthdateHash = Math.abs(hash(birthdate.toString())).toString()
    const nameHash = Math.abs(hash(name)).toString()
    const emailHash = Math.abs(hash(email)).toString()

    const getHashPart = (hash, length, chars) => {
        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars[parseInt(hash.charAt(i % hash.length), 10) % chars.length]
        }
        return result
    }

    const letterPart = getHashPart(birthdateHash + nameHash + emailHash, 4, letters)
    const digitPart = getHashPart(birthdateHash + nameHash + emailHash, 4, digits)

    const code = `#${letterPart}${digitPart}`
    return code
}


// Get Emition & Expiration Date 
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

function getExpirationDate(days) {
    const emitionDate = new Date()
    const expirationDate = new Date(emitionDate)
    expirationDate.setDate(emitionDate.getDate() + days)
    return formatDate(expirationDate)
}

// Upload Client to Database
async function createClient(name, email, birthdate, rating, code, emitionDate, expirationDate, expired, claimed, valid) {

    console.log('Creating client:', name, email, birthdate, rating, code, emitionDate, expirationDate, expired, claimed, valid)

    try {            
        const response = await fetch(apiUrl + '/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, birthdate, rating, code, emitionDate, expirationDate, expired, claimed, valid })
        })

        if (!response.ok) {
            throw new Error('There was a problem connecting to the network')
        }

        const data = await response.json()
        console.log('Client created:', data)

    } catch (error) {
        console.error('Error:', error)
    }
}

var btn = document.getElementById("btn")
    btn.addEventListener('click', async function () {
        
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const birthdate = document.getElementById("birthdate").value
        const rating = getUserRating()
        const today = new Date()
        const code = generateCode(birthdate, name, email)
        const emitionDate = formatDate(today) 
        const expirationDate = getExpirationDate(30)
        const expired = "NO"
        const claimed = "NO"
        const valid = "YES"

        try {
            const allClients = await getAll('clients')
            console.log(allClients)
            if (authenticateEmail(email, allClients)) {
                await createClient(name, email, birthdate, rating, code, emitionDate, expirationDate, expired, claimed, valid)
                console.log('Client created successfully')
                // window.location.href = `greeting.html?email=${encodeURIComponent(email)}`
                window.location.href = 'done.html'
            } else {
                alert(`${email} already exists in the databse.`)
            }
            
        } catch (error) {
            console.error('Error creating client:', error)
        }
    })