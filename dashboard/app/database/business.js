// Lattefy's frontend business file

// Get a business by ID
async function getBusinessById(businessId) {
    try {
        const response = await fetch(`${apiUrl}/business/${businessId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('dbAccessToken')}`,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            if (response.status === 404) {
                return { message: "Business not found" }
            }
            throw new Error(`Error fetching business: ${response.statusText}`)
        }

        const business = await response.json()
        return business
    } catch (error) {
        console.error("Error fetching business by ID:", error)
        return null
    }
}


// Get all business's clients
async function getClientsByBusinessId(businessId) {
    try {
        const response = await fetch(`${apiUrl}/clients/b/${businessId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('dbAccessToken')}`,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(`Error fetching clients: ${response.statusText}`)
        }

        const clients = await response.json()
        return clients
    } catch (error) {
        console.error("Error fetching clients:", error)
        return []
    }
}

// Get all business's cards
async function getCardsByBusinessId(businessId) {
    try {
        const response = await fetch(`${apiUrl}/cards/b/${businessId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('dbAccessToken')}`,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(`Error fetching cards: ${response.statusText}`)
        }

        const cards = await response.json()
        return cards
    } catch (error) {
        console.error("Error fetching cards:", error)
        return []
    }
}


// Sum field
async function sumField(cards, field) {
    const fieldArray = cards.map(card => card[field] || 0)
    return fieldArray.reduce((acc, value) => acc + value, 0)
}


async function getTotalPoints(cards) {
    return sumField(cards, 'totalPoints')
}


// Business Average Expenditure
function businessAverageExpenditure(cards) {
    const totalSpentArray = cards.map(card => card.totalSpent || 0)
    const totalSpent = totalSpentArray.reduce((acc, value) => acc + value, 0)

    const purchases = cards.map(card => card.purchases || 0)
    const totalPurchases = purchases.reduce((acc, value) => acc + value, 0)

    let sum
    if (totalSpent && totalPurchases) {
        const avg = totalSpent / totalPurchases
        sum = `$ ${avg.toFixed(2)}`
    } else sum = 'N/A'

    return sum

}