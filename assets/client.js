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

// Upload Client to Database
async function createClient(name, email, phoneNumber) {

    console.log('Creating client:', name, email, phoneNumber)

    try {            
        const response = await fetch(apiUrl + '/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phoneNumber })
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
        const phoneNumber = document.getElementById("phone-number").value

        try {
            const allClients = await getAll('clients')
            console.log(allClients)
            if (authenticateEmail(email, allClients)) {
                await createClient(name, email, phoneNumber)
                console.log('Client created successfully')
                // window.location.href = `greeting.html?email=${encodeURIComponent(email)}`
            } else {
                alert(`${email} already exists in the databse.`)
            }
            
        } catch (error) {
            console.error('Error creating client:', error)
        }
    })