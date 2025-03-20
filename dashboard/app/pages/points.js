// Lattefy's frontend dashboard points file

// 1) Function to handle UI (toggle between Add Points / Claim Reward)
function handlePointsUI() {
    const functionSelector = document.getElementById("function-selector")
    const addInputs = document.getElementById("add-points-inputs")
    const claimInputs = document.getElementById("claim-reward-inputs")

    if (functionSelector.value === "add-points") {
        addInputs.style.display = "flex"
        claimInputs.style.display = "none"
    } else {
        addInputs.style.display = "none"
        claimInputs.style.display = "flex"
    }
}

// 2) Function to calculate suggested points (based on amount spent)
function calculatePoints(template, amountSpent) {
    let points = 0

    if (template.pointAddition === "FIXED") {
        points = 1
    } else if (template.pointAddition === "LINEAR") {
        if (amountSpent > 0) {
            points = Math.floor(amountSpent / template.pointCost)
        }
    }

    // Update the displayed value (if user hasn't manually modified it)
    const suggestedPointsDisplay = document.getElementById("point-amount")
    if (!window.userModifiedPoints) {
        suggestedPointsDisplay.textContent = points
    }

    return points
}


// 3) Function to add points to a card
async function addPoints(phoneNumber, businessId, template, amountSpent) {
    const card = await getSpecificCard(phoneNumber)
    console.log(card)
    if (!card) {
        alert("No se encontró la tarjeta del cliente.")
        return
    }

    let pointsToAdd = parseInt(document.getElementById("point-amount").textContent) || 0

    // Handle currentPoints (prevent null issues)
    let currentPoints = card.currentPoints ?? 0
    let totalPoints = card.totalPoints ?? 0
    let totalSpent = card.totalSpent ?? 0
    let purchases = card.purchases ?? 0

    // Prevent over-crediting points (if max is reached)
    if (currentPoints >= template.pointsNeeded) {
        alert(`${currentPoints}/${template.pointsNeeded}: El cliente debe reclamar su regalo antes de sumar más puntos.`)
        return
    }

    currentPoints += pointsToAdd
    totalPoints += pointsToAdd
    totalSpent += amountSpent
    purchases += 1

    // Prevent exceeding the max points needed for a reward
    if (currentPoints > template.pointsNeeded) {
        currentPoints = template.pointsNeeded
    }

    const averageExpenditure = totalSpent / purchases

    let updates = {
        currentPoints: currentPoints,
        totalPoints: totalPoints,
        totalSpent: totalSpent,
        purchases: purchases,
        averageExpenditure: averageExpenditure
    }

    if (currentPoints >= template.pointsNeeded) {
        updates.rewardAvailable = true
    }

    await updateCard(phoneNumber, businessId, template.templateId, updates)
    alert(`Se han agregado ${pointsToAdd} ${template.pointsName}: ${updates.currentPoints}/${template.pointsNeeded}`)
}


// 4) Function to claim reward
async function claimReward(phoneNumber, businessId, template) {
    const card = await getSpecificCard(phoneNumber)

    if (!card) {
        alert("No se encontró la tarjeta del cliente.")
        return
    }
    if (!card.rewardAvailable || card.currentPoints < template.pointsNeeded) {
        alert(`${card.currentPoints}/${template.pointsNeeded}: El cliente no tiene recompensas disponibles.`)
        return
    }

    const updates = {
        currentPoints: 0,
        rewardAvailable: false,
        rewardsClaimed: (card.rewardsClaimed || 0) + 1
    }

    await updateCard(phoneNumber, businessId, template.templateId, updates)
    await sendBusinessEmail(phoneNumber, template.templateId, 'reward')
    alert(`El cliente ha reclamado su ${template.reward}!`)
}
