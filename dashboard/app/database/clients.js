// Lattefy's frontend dashboard clients file

// Display clients
function displayClientsTable(clients) {

    const clientOutput = document.getElementById('allClients')
    clientOutput.innerHTML = ''
    const fieldsToAvoid = [
        '_id', 'businessids', 'createdat', 'updatedat', 'password', '__v'
    ]

    let rows = clients.map(client => {
        let row = '<tr>'
        Object.entries(client).forEach(([key, value]) => {
            if (!fieldsToAvoid.includes(key.toLowerCase())) {
                row += `<td data-label="${capitalizeFirstLetter(key)}">${value}</td>`
            }
        })
        row += '</tr>'
        return row
    }).join('')
    
    clientOutput.innerHTML = rows
    
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// Fetch client details by phone number
async function getClient(clientPhoneNumber) {
    try {
        const response = await fetch(`${apiUrl}/clients/${clientPhoneNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('dbAccessToken')}`
            }
        })
        if (!response.ok) {
            throw new Error('Failed to fetch client details')
        }
        return await response.json()
    } catch (error) {
        console.error(error)
        return null
    }
}