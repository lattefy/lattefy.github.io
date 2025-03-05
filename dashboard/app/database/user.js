// Lattefy's frontend dashboard user file

async function getUserByUsername(username) {
    try {
        const response = await fetch(`${apiUrl}/users/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('dbAccessToken')}`
            }
        })
        if (!response.ok) {
            throw new Error('Failed to fetch client details')
        }
        return await response.json()

    } catch (error) {
        console.log(error)
        return null
    }
}