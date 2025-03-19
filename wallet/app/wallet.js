// Lattefy's frontend wallet main file

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {
    const loader = document.getElementById("loader")

    // URL Params
    const urlParams = new URLSearchParams(window.location.search)
    const businessIdParam = urlParams.get('b')
    const templateIdParam = urlParams.get('t')
    if (businessIdParam && templateIdParam) {
        sessionStorage.setItem('storedBusinessId', businessIdParam)
        sessionStorage.setItem('storedTemplateId', templateIdParam)
    }

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
                        error('Error al iniciar sesión')
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
                        window.location.href = './done.html'
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

    // Homepage
    if (document.getElementById('home')) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        const noCardsMessage = document.getElementById("no-cards-message")

        // If user is not logged in
        if (!accessToken || !refreshToken) {
            window.location.href = './login.html' // Redirect to login
        }

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

            // Check if a specific businessId and templateId were stored (QR Scan)
            const storedBusinessId = sessionStorage.getItem('storedBusinessId')
            const storedTemplateId = sessionStorage.getItem('storedTemplateId')

            // Retrieve cardBusinessId and cardTemplateId for Discover Page additions
            const cardBusinessId = sessionStorage.getItem('cardBusinessId')
            const cardTemplateId = sessionStorage.getItem('cardTemplateId')

            let cards = await getClientCards(clientData.phoneNumber) // Fetch cards 

            if (cards.length === 0) {
                console.log('No cards to display')
                noCardsMessage.classList.add("active")
                loader.style.display = 'none'
                return
            }

            // 🚀 Fetch all templates in parallel to improve speed
            const templates = await Promise.all(
                cards.map(card => getTemplate(card.templateId))
            )

            // 🔥 Filter valid cards (only ACTIVE templates)
            let validCards = cards.filter((card, index) => {
                const template = templates[index]
                if (template && template.status === 'ACTIVE') {
                    return true
                } else {
                    console.warn(`Skipping card ${card.templateId}: ${template ? 'Inactive' : 'Not found'}`)
                    return false
                }
            })

            if (storedBusinessId && storedTemplateId) {
                console.log("QR scan detected. Handling business QR...")

                // QR Code Scan
                const updatedCards = await handleBusinessQR(clientData.phoneNumber, storedBusinessId, storedTemplateId)
                sessionStorage.removeItem('storedBusinessId')
                sessionStorage.removeItem('storedTemplateId')

                if (updatedCards.length > 0) {
                    console.log("Sorting the added card to the front...")
                    await sortCards(updatedCards, storedBusinessId, storedTemplateId, clientData.phoneNumber)
                } else {
                    console.log("Sorting the selected card to the front...")
                    await sortCards(validCards, storedBusinessId, storedTemplateId, clientData.phoneNumber)
                }
            } 

            // Discover page / Display Cards
            else if (validCards.length > 0) {
                if (cardBusinessId && cardTemplateId) {
                    console.log("Sorting the card to the front (Discover Page)...")
                    await sortCards(validCards, cardBusinessId, cardTemplateId, clientData.phoneNumber)
                    sessionStorage.removeItem('cardBusinessId')
                    sessionStorage.removeItem('cardTemplateId') // Clear after sorting
                } else {
                    console.log("Displaying filtered cards...")
                    await displayClientCards(validCards, clientData.phoneNumber)
                }
            } else {
                console.log('No active cards to display')
                noCardsMessage.classList.add("active")
                loader.style.display = 'none'
            }
        } catch (error) {
            console.error('Error fetching or displaying cards:', error)
            noCardsMessage.classList.add("active") // Display "No Cards" message on error
            loader.style.display = 'none'
        }
    }

    // Discover Page 
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
