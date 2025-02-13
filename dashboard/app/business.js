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


