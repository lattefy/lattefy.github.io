// Lattefy's frontend wallet qr business file

// business.js

// Function to check URL parameters and create a card if necessary
async function handleBusinessQR(clientPhoneNumber, businessId, templateId) {
    
    if (!businessId || !templateId || !clientPhoneNumber) return

    // Ensure user is logged in
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    try {
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
                alert('Ya tienes esta tarjeta') // Change to popup in the future
            } else {
                alert('Error al agregar tarjeta')
            }
            return
        }
        alert('Tarjeta agregada con éxito') 
        window.history.replaceState(null, '', window.location.pathname)

    } catch (error) {
        console.error('Error processing QR:', error)
        alert('Error en la solicitud')
    }
}
