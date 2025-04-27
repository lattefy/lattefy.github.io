// Lattefy's frontend dashboard cards file

// Get Card
async function getSpecificCard(phoneNumber) {
    try {
        const response = await fetch(`${apiUrl}/cards/${phoneNumber}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('dbAccessToken')}`,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            if (response.status === 404) {
                return { message: "Card not found" }
            }
            throw new Error(`Error fetching card: ${response.statusText}`)
        }

        const card = await response.json()
        return card[0]

    } catch (error) {
        console.error("Error fetching card:", error)
        return null
    }
}

// Update Card
async function updateCard(phoneNumber, businessId, templateId, updates) {
    try {
        const response = await fetch(`${apiUrl}/cards`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("dbAccessToken")}`
            },
            body: JSON.stringify({
                clientPhoneNumber: phoneNumber,
                businessId,
                templateId,
                ...updates // Include dynamic updates
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to update card")
        }

        return await response.json()

    } catch (error) {
        console.error("Error updating card:", error)
        return null
    }
}

// Display card
function displayCardsTable(cards) {

    const cardsOutput = document.getElementById('allCards')
    cardsOutput.innerHTML = ''
    const fieldsToAvoid = [
        '_id', 'businessid', 'createdat', 'updatedat', 'templateid', 'status', '__v'
    ]

    let rows = cards.map(card => {
        let row = '<tr>'
        Object.entries(card).forEach(([key, value]) => {
            if (!fieldsToAvoid.includes(key.toLowerCase())) {
                row += `<td data-label="${capitalizeFirstLetter(key)}">${value}</td>`
            }
        })
        row += '</tr>'
        return row
    }).join('')
    
    cardsOutput.innerHTML = rows
    
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}