// Lattefy's frontend wallet QR business file

// Function to check URL parameters and create a card if necessary
async function handleBusinessQR(clientPhoneNumber, businessId, templateId) {
    if (!businessId || !templateId || !clientPhoneNumber) return []

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return []

    try {
        let cardAdded = false

        // Attempt to create a new card
        const response = await fetch(`${apiUrl}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                clientPhoneNumber,
                businessId,
                templateId
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            if (errorData.message === 'Card already exists') {
                console.log('Ya tienes esta tarjeta')
            } else {
                console.error('Card creation error:', errorData)
                alert('Error al agregar tarjeta')
                return []
            }
        } else {
            cardAdded = true

            // Send email
            await sendBusinessEmail(clientPhoneNumber, templateId, 'card')

            // Add the business ID to the client only if a new card was added
            await fetch(`${apiUrl}/clients/${clientPhoneNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    newBusinessId: businessId
                })
            })

            alert('Tarjeta agregada con éxito')
        }

        // Fetch updated cards
        let updatedCards = []
        if (cardAdded) {
            console.log("Fetching updated cards...")
            updatedCards = await getClientCards(clientPhoneNumber)
        }

        return updatedCards

    } catch (error) {
        console.error('Error processing QR:', error)
        alert('Error en la solicitud')
        return []
    } finally {
        window.history.replaceState(null, '', window.location.pathname) // Ensure URL cleanup
    }
}
