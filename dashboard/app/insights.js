/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DASHBOARD INSIGHTS --------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Display the amount of clients
function displayClientCount(clients) {
    const clientAmount = document.getElementById('client-amount')
    clientAmount.textContent = clients.length 
}

// Display discounts gotten
function displayDiscountsGotten(clients) {
    const allDiscountsGotten = clients.map(client => client.discountsGotten)

    let discountGottenSum = 0
    for (let i = 0; i < allDiscountsGotten.length; i++) {
        discountGottenSum += allDiscountsGotten[i]
    }

    const discountsGottenOutput = document.getElementById('discounts-gotten')
    discountsGottenOutput.textContent = discountGottenSum
}

// Display discounts claimed
function displayDiscountsClaimed(clients) {
    const allDiscountsClaimed = clients.map(client => client.discountsClaimed)

    let discountsClaimedSum = 0
    for (let i = 0; i < allDiscountsClaimed.length; i++) {
        discountsClaimedSum += allDiscountsClaimed[i]
    }

    const discountsClaimedOutput = document.getElementById('discounts-claimed')
    discountsClaimedOutput.textContent = discountsClaimedSum
}

// Calculate Overall Average Rating
function sentimentAnalysis(clients) {
    const allRatings = clients.map(client => client.averageRating)

    let ratingSum = 0
    for (let i = 0; i < allRatings.length; i++) {
        ratingSum += allRatings[i]
    }

    const overallRating = ratingSum / clients.length
    
    const sentimentOutput = document.getElementById('sentiment-analysis')
    sentimentOutput.textContent = overallRating.toFixed(2)
}

// Calculate Overall Average Expenditure
function displayAverageExpenditure(clients) {
    const allExpenditures = clients.map(client => client.averageExpenditure)
    const allDiscountsClaimed = clients.map(client => client.discountsClaimed)

    let expenditureSum = 0
    for (let i = 0; i < allExpenditures.length; i++) {
        expenditureSum += allExpenditures[i]
    }

    let discountsClaimedSum = 0
    for (let i = 0; i < allDiscountsClaimed.length; i++) {
        discountsClaimedSum += allDiscountsClaimed[i]
    }

    const overallExpenditure = expenditureSum / discountsClaimedSum
    
    const expenditureOutput = document.getElementById('average-expenditure')
    expenditureOutput.textContent = "$" + overallExpenditure.toFixed(2)
}

// Display Total Profit
function displayTotalProfit(clients) {
    const allTotals = clients.map(client => client.totalSpent)

    let totalSum = 0
    for (let i = 0; i < allTotals.length; i++) {
        totalSum += allTotals[i]
    }
    
    const totalOutput = document.getElementById('total-profit')
    totalOutput.textContent = "$" + totalSum.toFixed(2)
}