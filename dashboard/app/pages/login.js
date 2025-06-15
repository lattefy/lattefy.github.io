// Lattefy's frontend dashboard login file

// User login
async function userLogin(username, password) {
    try {
        const response = await fetch(`${apiUrl}/auth/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        if (!response.ok) throw new Error('Authentication failed')

        const data = await response.json()
        localStorage.setItem('dbAccessToken', data.accessToken)
        localStorage.setItem('dbRefreshToken', data.refreshToken)
        return data
    } catch (error) {
        console.error('Login error:', error)
        return null
    }
}

// Login page
document.addEventListener('DOMContentLoaded', async function (){

    const accessToken = localStorage.getItem('dbAccessToken')
    const refreshToken = localStorage.getItem('dbRefreshToken')
    if (accessToken && refreshToken) {
        window.location.href = './index.html'
    }

    document.getElementById('login-btn').addEventListener('click', async function (event) {
        event.preventDefault()

        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        loader.style.display = 'block'

        try {
            const data = await userLogin(username, password)
            if (data) {
                // window.location.href = './index.html'
                await redirectToMainPage(data)
            } else {
                alert('Error al iniciar sesión')
                loader.style.display = 'none'
            }
        } catch (error) {
            console.error('Login error:', error)
            window.location.href = './login.html' 
        }
        
    })

}) 


            
    
