// Lattefy's frontend dashboard auth file

// User authentication
async function authUser(accessToken, refreshToken) {
    if (!accessToken || !refreshToken) {
        console.log('No tokens found, redirecting to login.')
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = './login.html'
        }
        return
    }

    try {
        const response = await fetch(`${apiUrl}/auth/users/verify-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })

        if (response.ok) {
            const userData = await response.json()
            console.log('Token valid. User: ', userData)
            return userData
        } else if (response.status === 403) {
            console.log('Access token expired, attempting refresh...')
            const newAccessToken = await refreshAccessToken(refreshToken)

            if (newAccessToken) {
                return authUser(newAccessToken, refreshToken)
            } else {
                console.error('Failed to refresh token.')
                localStorage.clear()
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = './login.html'
                }
            }
        } else {
            console.error('Unexpected error:', response.statusText)
        }
    } catch (error) {
        console.error('Auth error:', error)
        localStorage.clear()
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = './login.html'
        }
    }
}


// Generate access token (refresh token)
async function refreshAccessToken(refreshToken) {
    console.log('Refresh Token:', refreshToken);
    try {
        const response = await fetch(`${apiUrl}/auth/users/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        })
        if (response.ok) {
            const { accessToken } = await response.json()
            localStorage.setItem('dbAccessToken', accessToken)
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


