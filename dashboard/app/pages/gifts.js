// Lattefy's frontend dashboard gifts file


// Function to handle UI 
function handleGiftsUI() {
    const functionSelector = document.getElementById("function-selector")
    const giftBtn = document.getElementById("gift-btn")

    if (functionSelector.value === "claim-gift") {
        giftBtn.textContent = "Canjear"
        //giftBtn.onclick = () => claimGift() 
    } else if (functionSelector.value === "check-gift") {
        giftBtn.textContent = "Verificar"
        //giftBtn.onclick = () => checkGiftAvailability() 
    } else {
        giftBtn.textContent = "Regalar"
        //giftBtn.onclick = () => makeGift() 
    }

    giftBtn.style.display = "flex"
}

// Function to get the template details
async function updateGiftDetails(templateId) {
    const detailsList = document.getElementById("gift-details")
    const template = await getTemplateById(templateId)

    if (!template) {
        detailsList.innerHTML = "<li>...</li>"
        return
    }

    const { gift, expiryTime } = template

    detailsList.innerHTML = `
        <li>Regalo: ${gift || "No especificado"}</li>
        <li>Duración: ${expiryTime || "No especificada"} días</li>
    `
}

// Claim Gift Function
async function claimReward(phoneNumber, businessId, template) {
    const card = await getSpecificCard(phoneNumber, template.templateId)

    if (!card) {
        alert("No se encontró la tarjeta del cliente.")
        return
    }
    if (card.giftAvailable == false || card.status !== "ACTIVE") {
        alert(`El cliente no tiene recompensas disponibles: ya canjeó su regalo`)
        return
    }
    if (isCardExpired(card, template)) {
        alert("La tarjeta del cliente ha expirado. No puede reclamar el regalo")
    }

    const updates = {
        giftAvailable: false,
        status: "CLAIMED",
        rewardsClaimed: (card.rewardsClaimed || 0) + 1
    }

    await updateCard(phoneNumber, businessId, template.templateId, updates)
    alert(`El cliente ha reclamado su ${template.gift}!`)
}

// Check if the card is expired
function isCardExpired(card, template) {
    const expiryTime = template.expiryTime
    if (!expiryTime || !card?.createdAt) return false // treat as non-expiring

    const createdAt = new Date(card.createdAt)
    const expirationDate = new Date(createdAt)
    expirationDate.setDate(createdAt.getDate() + Number(expiryTime))

    const now = new Date()
    return now > expirationDate
}