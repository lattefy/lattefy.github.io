// Lattefy's wallet script (main)

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {

    const loader = document.getElementById("loader")
    // window.addEventListener("load", function () {
    //   loader.style.display = "none"
    // })

    // Login
    if (document.getElementById('login')) {

        // Authenticate client
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken && refreshToken) {
            window.location.href = './index.html'
        }

        // Client login
        document.getElementById('login-btn').addEventListener('click', async function (event) {
            event.preventDefault()

            const phoneNumber = document.getElementById('phone-number').value
            const password = document.getElementById('password').value

            const isPhoneNumberValid = validatePhoneNumber(phoneNumber)
            const isPasswordValid = validatePassword(password)

            if (isPasswordValid && isPhoneNumberValid) {

                loader.style.display = 'block'

                try {
                    const data = await clientLogin(phoneNumber, password)
                    if (data) {
                        window.location.href = './index.html'
                        console.log(data)
                    } else {
                        alert('Error al iniciar sesión')
                        window.location.href = './login.html'
                    }
                } catch (error) {
                    console.error('Login error:', error)
                    window.location.href = './login.html'
                }

            }

        })

    }

    // Homepage
    if (document.getElementById('home')) {

        // Authenticate client
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        try {

            const clientData = await authClient(accessToken, refreshToken)
            if (!clientData || !clientData.phoneNumber) {
                throw new Error('Client authentication failed or missing phone number')
            }

            console.log('Authenticated Client:', clientData)

            // Fetch client details to get the name
            const client = await getClient(clientData.phoneNumber)
            if (!client) {
                throw new Error('Failed to fetch client details')
            }

            console.log('Client details:', client)

            // Now fetch client cards using the phone number
            const cards = await getClientCards(clientData.phoneNumber)

            if (cards && cards.length > 0) {
                await displayClientCards(cards, clientData.phoneNumber)
            } else {
                console.log('No cards to display')
            }

        } catch (error) {
            console.error('Error fetching or displaying cards:', error)
        }
    }


    // Logged in activity
    if (document.getElementById('home') || document.getElementById('discover')) {

        // Log out
        document.getElementById('logout-btn').addEventListener('click', async () => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = './login.html'
        })

    }

})