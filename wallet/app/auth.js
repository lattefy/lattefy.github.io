// Lattefy's auth script

// Client login
async function clientLogin(phoneNumber, password) {
    try{
        const response = await fetch(`${apiUrl}/auth/clients/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, password })
        })
        if (!response.ok) throw new Error('Authentication failed')

        const data = await response.json()
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        return data

    } catch (error) {
        console.error('Login error:', error)
    }
}

// Client authentication
async function authClient(accessToken, refreshToken) {

    if (!accessToken || !refreshToken) {
        console.log('No tokens found, redirecting to login.')
        window.location.href = './login.html'
    }

    try {
        const response = await fetch(`${apiUrl}/auth/clients/verify-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })

        if (response.ok) {
            const clientData = await response.json()
            console.log('Token valid. Client:', clientData)
            return clientData
        } else if (response.status === 403) {
            console.log('Access token expired, attempting refresh...')
            const newAccessToken = await refreshAccessToken(refreshToken)

            if (newAccessToken) {
                return authClient(newAccessToken, refreshToken)
            } else {
                console.error('Failed to refresh token.')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = './login.html'
            }
        } else {
            console.error('Unexpected error:', response.statusText)
        }
    } catch (error) {
        console.error('Auth error:', error)
        window.location.href = './login.html'
    } 

}

// Generate access token (refresh token)
async function refreshAccessToken(refreshToken) {
    console.log('Refresh Token:', refreshToken);
    try {
        const response = await fetch(`${apiUrl}/auth/clients/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        })
        if (response.ok) {
            const { accessToken } = await response.json()
            localStorage.setItem('accessToken', accessToken)
            return accessToken
        } else {
            console.error('Failed to refresh access token.')
            return null
        }
    } catch (error) {
        console.error('Error refreshing access token:', error)
        return null
    }
}


