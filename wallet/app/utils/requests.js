
async function get(database, id) {
    try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch(`${apiUrl}/${database}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch ${database} with ID ${id}`)
        }
        return await response.json()
    } catch (error) {
        console.error(error)
        return null
    }
}

// Fetch template by templateId
async function getTemplate(templateId) {
    try {
        console.log('Fetching template for templateId:', templateId)
        const token = localStorage.getItem('accessToken')
        const response = await fetch(`${apiUrl}/templates/${templateId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) {
            const templateData = await response.json()
            console.log('Fetched template:', templateData)
            return templateData[0]
        }
    } catch (error) {
        console.error(error)
        return null
    }
}