// Lattefy's frontend dashboard gifts file

async function getGift(phoneNumber, businessId, template) {
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