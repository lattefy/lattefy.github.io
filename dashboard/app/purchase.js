/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- UPLOAD PURCHASE ---------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Calculate dates
function calculateDate(days) {
    const today = new Date()
    const date = new Date(today)
    date.setDate(today.getDate() + days)
    return date
}

// Function to check if a date is expired
function isDateExpired(date) {
    const currentDate = new Date()
    console.log(`Current Date: ${currentDate}`)
    return date < currentDate
}

// Upload Purchase
async function uploadPurchase(email, amountSpentNow) {

    const clients =  await getAll('clients')
    const client = getClientByEmail(clients, email)

    if (client) {
        
        const amountSpentNowNum = parseFloat(amountSpentNow)
        if (isNaN(amountSpentNowNum)) {
            console.error('Invalid amount spent:', amountSpentNow)
            return
        }

        const totalExpenditure = client.totalSpent + amountSpentNowNum
        const discountsClaimed = client.discountsClaimed + 1
        let averageExpenditure

        if (client.discountsGotten == 1) {
            averageExpenditure = totalExpenditure
        } else {
            averageExpenditure = totalExpenditure / client.discountsGotten
        }

        const updates = {}

        // Authenticate a discount

        const expirationDate = new Date(client.expirationDate) 
        const expired = isDateExpired(expirationDate)

        console.log(`Expiration Date: ${expirationDate}`)
        console.log(expired)

        if (client.discountAvailable) {

            if (expired) {
                alert('El descuento esta vencido.')
            } else {

                updates.discountAvailable = false
                updates.emissionDate = calculateDate(1)
                updates.expirationDate = calculateDate(31)

                updates.discountsClaimed = discountsClaimed
                updates.totalSpent = totalExpenditure
                updates.averageExpenditure = averageExpenditure.toFixed(2)

                await updateClient(email, updates)
                alert('Se ha cargado la compra con exito!')

            }

        } else {
            alert('No hay descuento disponible.')
        }

    } else {
        alert('No se ha encontrado el cliente.')
    }

}