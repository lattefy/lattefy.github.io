// Lattefy's frontend dashboard template file

// Function to get template by id
async function getTemplateById(templateId) {
    try {
        const response = await fetch(`${apiUrl}/templates/${templateId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('dbAccessToken')}`,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            if (response.status === 404) {
                return { message: "Template not found" }
            }
            throw new Error(`Error fetching template: ${response.statusText}`)
        }

        const template = await response.json()
        return template[0]
    } catch (error) {
        console.error("Error fetching template by ID:", error)
        return null
    }
}