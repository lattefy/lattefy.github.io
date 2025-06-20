// Lattefy's frontend dashboard stats file

// total Clients
function displayTotalClients(clients) {
    const output = document.getElementById('total-clients')
    output.innerHTML = clients.length
}

// total Cards
function displayTotalCards(cards) {
    const output = document.getElementById('total-cards')
    output.innerHTML = cards.length
}

// total Purhcases
function displayTotalPurchases(cards) {
    const output = document.getElementById('total-purchases')

    const purchasesArray = cards.map(card => card.purchases || 0)
    const sum = purchasesArray.reduce((acc, value) => acc + value, 0)

    output.innerHTML = sum
}

// total Points
function displayTotalPoints(cards) {
    const output = document.getElementById('total-points')

    const totalPointsArray = cards.map(card => card.totalPoints || 0)
    const sum = totalPointsArray.reduce((acc, value) => acc + value, 0)

    output.innerHTML = sum
}

// total Rewards Claimed
function displayTotalRewardsClaimed(cards) {
    const output = document.getElementById('total-rewards')

    const totalRewardsArray = cards.map(card => card.rewardsClaimed || 0)
    const sum = totalRewardsArray.reduce((acc, value) => acc + value, 0)

    output.innerHTML = sum
}

// Total Points / Rewards Claimed
async function displayTotalType(cards, business, fidelityTemplateId, giftTemplateId, discountTemplateId) {

    const totalPointsArray = cards.map(card => card.totalPoints || 0)
    const sum = totalPointsArray.reduce((acc, value) => acc + value, 0)

    // Update Total Points / Rewards Box
    const totalPointsTitle = document.getElementById("total-points-title")
    const totalPointsValue = document.getElementById("total-points")

    if (fidelityTemplateId) {
        const fidelityTemplate = await getTemplateById(fidelityTemplateId)
        totalPointsTitle.textContent = `${fidelityTemplate.pointsName} Totales`
        totalPointsValue.textContent = sum
    } else if (giftTemplateId) {
        const giftTemplateId = await getTemplateById(giftTemplateId)
        totalPointsTitle.textContent = "Recompensas Canjeadas"
        totalPointsValue.textContent = business.rewardsClaimed || "0"
    } else {
        totalPointsTitle.textContent = 'Puntos Totales'
        totalPointsValue.textContent = sum
    }

}

// Total Spent
function displayTotalSpent(cards) {
    const output = document.getElementById('total-spent')

    const totalSpentArray = cards.map(card => card.totalSpent || 0)
    const sum = totalSpentArray.reduce((acc, value) => acc + value, 0)
    output.textContent = `$ ${sum}`
}

// Average Expenditure
function displayAverageExpenditure(cards) {
    const output = document.getElementById('average-expenditure')

    const totalSpentArray = cards.map(card => card.totalSpent || 0)
    const totalSpent = totalSpentArray.reduce((acc, value) => acc + value, 0)

    const purchases = cards.map(card => card.purchases || 0)
    const totalPurchases = purchases.reduce((acc, value) => acc + value, 0)

    let sum
    if (totalSpent && totalPurchases) {
        const avg = totalSpent / totalPurchases
        sum = `$ ${avg.toFixed(2)}`
    } else sum = 'N/A'

    output.textContent = sum

}
