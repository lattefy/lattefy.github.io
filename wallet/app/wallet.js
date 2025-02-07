// Lattefy's frontend wallet script (main)

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {
    const loader = document.getElementById("loader")

    // Login
    if (document.getElementById('login')) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken && refreshToken) {
            window.location.href = './index.html'
        }

        document.getElementById('login-btn').addEventListener('click', async function (event) {
            event.preventDefault()

            const phoneNumber = document.getElementById('phone-number').value
            const password = document.getElementById('password').value

            if (validatePhoneNumber(phoneNumber) && validatePassword(password)) {
                loader.style.display = 'block'

                try {
                    const data = await clientLogin(phoneNumber, password)
                    if (data) {
                        window.location.href = './index.html'
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

    // Signup
    if (document.getElementById('signup')) {
        document.getElementById('signup-btn').addEventListener('click', async function (event) {
            event.preventDefault()

            const name = document.getElementById('name').value
            const phoneNumber = document.getElementById('phone-number').value
            const email = document.getElementById('email').value
            const password = document.getElementById('password').value

            if (validateInputs(name, phoneNumber, email, password)) {
                loader.style.display = 'block'

                try {
                    const data = await clientSignup(name, phoneNumber, email, password)
                    if (data) {
                        window.location.href = './index.html'
                    }
                } catch (error) {
                    window.location.href = './signup.html'
                }
            } else {
                console.log('Invalid inputs')
            }
        })
    }

    // Done
    if (document.getElementById('done')) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        if (accessToken && refreshToken) {
            document.getElementById('done-btn').addEventListener('click', async () => {
                window.location.href = './index.html'
            })
        }
    }

    // Homepage Authentication
    if (document.getElementById('home')) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        const noCardsMessage = document.getElementById("no-cards-message")

        try {
            loader.style.display = 'block'

            const clientData = await authClient(accessToken, refreshToken)
            if (!clientData || !clientData.phoneNumber) {
                throw new Error('Client authentication failed or missing phone number')
            }

            console.log('Authenticated Client:', clientData)

            const client = await getClient(clientData.phoneNumber)
            if (!client) {
                throw new Error('Failed to fetch client details')
            }

            console.log('Client details:', client)

            const cards = await getClientCards(clientData.phoneNumber)

            if (cards && cards.length > 0) {
                await displayClientCards(cards, clientData.phoneNumber)
                noCardsMessage.classList.remove("active")
            } else {
                console.log('No cards to display')
                noCardsMessage.classList.add("active")
            }

            loader.style.display = 'none'
        } catch (error) {
            console.error('Error fetching or displaying cards:', error)
        }
    }

    // Discover Page Authentication
    if (document.getElementById("discover")) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        try {
            loader.style.display = 'block'

            const clientData = await authClient(accessToken, refreshToken)
            if (!clientData || !clientData.phoneNumber) {
                throw new Error('Client authentication failed or missing phone number')
            }

            console.log("Authenticated Client for Discover Page:", clientData)

            document.getElementById("add-card-btn").addEventListener("click", addCard)
            document.getElementById("cancel-btn").addEventListener("click", closePopup)
            await fetchTemplates()
            setupSearch("search-bar", "templates-container", "template-box", ".template-business-name")

            loader.style.display = 'none'
        } catch (error) {
            console.error("Error authenticating Discover Page:", error)
            window.location.href = './login.html' // Redirect if authentication fails
        }
    }

    // Logout
    if (document.getElementById('home') || document.getElementById('discover')) {
        document.getElementById('logout-btn').addEventListener('click', async () => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = './login.html'
        })
    }
})
